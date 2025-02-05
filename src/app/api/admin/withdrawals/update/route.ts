import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface WithdrawalStatusInput {
  id: string;
  status: 'pending' | 'delayed' | 'canceled' | 'completed';
  reason?: string;
  userId: string;
  amount: number;
  wallet_address: string;
}

export async function POST(request: Request) {
  try {
    const { id, status, reason, userId, amount, wallet_address } = await request.json() as WithdrawalStatusInput;

    // Input validation
    if (!id || !status || !userId || amount <= 0 || !wallet_address) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }



  

    // Prepare rollback function with original status
    const rollback = async (error: any) => {
      console.error('Operation failed, attempting rollback:', error);
      try {
        const { error: rollbackError } = await supabase
          .from('withdrawal_queue')
          .update({ 
            status: 'pending',
            reason: `Rolled back to pending due to error: ${error.message}`
          })
          .eq('id', id);

        if (rollbackError) {
          console.error('Rollback failed:', rollbackError);
          throw rollbackError;
        }
        console.log(`Successfully rolled back withdrawal ${id} to status: pending`);
      } catch (rollbackError) {
        console.error('Critical: Rollback failed:', rollbackError);
        throw new Error(`Critical: Both operation and rollback failed. Manual intervention required for withdrawal ${id}`);
      }
    };



    if (status === 'delayed'){
      const { error } = await supabase
        .from('withdrawal_queue')
        .update({ 
          status: 'delayed',
          reason: reason
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Withdrawal status updated successfully' });
    
    }else if (status === 'canceled'){
      const { error } = await supabase
        .from('withdrawal_queue')
        .update({ 
          status: 'canceled',
          reason: reason || null
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Withdrawal status updated successfully' });
    }else   
   
    if (status === 'completed') {
      try {
        // Process the withdrawal using the Bitget API
        // https://eurobankv2.vercel.app/api/bitget
        const response = await fetch(`https://eurobankv2.vercel.app/api/bitget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            walletAddress: wallet_address,
          }),
        });
         
        console.log(`Api response: ${response}`);
        if (!response.ok) {
          throw new Error(`Failed to process withdrawal: ${response.statusText}`);
        }

        const data = await response.json();
        const transactionHash = data.transactionHash || 'null';

        // Update the withdrawal queue to mark it as completed
        const { error: statusUpdateError } = await supabase
          .from('withdrawal_queue')
          .update({ 
            status: 'completed',
            reason: transactionHash !== 'null' ? `Transaction completed: ${transactionHash}` : undefined
          })
          .eq('id', id);

        if (statusUpdateError) {
          await rollback(statusUpdateError);
          return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
        }

        // Add the withdrawal to the withdrawal_list table
        const { error: listError } = await supabase
          .from('withdrawal_list')
          .insert({
            user_id: userId,
            withdrawal_id: id,
            amount,
            transaction_hash:  'null',
            wallet_address,
          });

        if (listError) {
          await rollback(listError);
          return NextResponse.json({ error: 'Failed to insert into withdrawal_list' }, { status: 500 });
        }

      } catch (withdrawalError) {
        await rollback(withdrawalError);
        return NextResponse.json(
          {
            error: 'Failed to process withdrawal through Bitget',
            details: (withdrawalError as Error).message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: 'Withdrawal status updated successfully' });
  } catch (error) {
    console.error('Unexpected error in withdrawal handler:', error);
    return NextResponse.json(
      {
        error: 'Unexpected error processing withdrawal',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}