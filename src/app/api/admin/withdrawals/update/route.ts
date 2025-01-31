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

    // Validate reason for specific statuses
    if (['delayed', 'canceled'].includes(status) && !reason) {
      return NextResponse.json({ error: 'Reason required for delayed or canceled status' }, { status: 400 });
    }

    // Get the current status before updating
    const { data: currentWithdrawal, error: fetchError } = await supabase
      .from('withdrawal_queue')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current withdrawal status:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch withdrawal status' }, { status: 500 });
    }

    const originalStatus = currentWithdrawal?.status || 'pending';

    // Prepare rollback function with original status
    const rollback = async (error: any) => {
      console.error('Operation failed, attempting rollback:', error);
      try {
        const { error: rollbackError } = await supabase
          .from('withdrawal_queue')
          .update({ 
            status: originalStatus,
            reason: `Rolled back to ${originalStatus} due to error: ${error.message}`
          })
          .eq('id', id);

        if (rollbackError) {
          console.error('Rollback failed:', rollbackError);
          throw rollbackError;
        }
        console.log(`Successfully rolled back withdrawal ${id} to status: ${originalStatus}`);
      } catch (rollbackError) {
        console.error('Critical: Rollback failed:', rollbackError);
        throw new Error(`Critical: Both operation and rollback failed. Manual intervention required for withdrawal ${id}`);
      }
    };

    // Update withdrawal status
    const { error: updateError } = await supabase
      .from('withdrawal_queue')
      .update({ status, reason })
      .eq('id', id);

    if (updateError) {
      await rollback(updateError);
      return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }

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
            transaction_hash: transactionHash,
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