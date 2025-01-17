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

    // Prepare rollback function
    const rollback = async (error: any) => {
      console.error('Operation failed, attempting rollback:', error);
      try {
        // Attempt to revert the withdrawal queue status if possible
        await supabase
          .from('withdrawal_queue')
          .update({ status: 'pending' }) // Or previous status
          .eq('id', id);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    };

    // Update withdrawal status
    const { error: updateError } = await supabase
      .from('withdrawal_queue')
      .update({ status, reason })
      .eq('id', id);

    if (updateError) {
      console.error('Withdrawal update error:', updateError);
      return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }

    if (status === 'completed') {
      try {
        // Process the actual withdrawal using the Bitget API
    
    const response = await fetch(`https://bitgetapi.onrender.com/api/withdrawal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        walletAddress: wallet_address,
      }),
    });

  
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`Failed to process withdrawal: ${response.statusText}`);
        }
        

        

        // Parse the JSON response to extract the transaction hash
        const data = await response.json();
        const { transactionHash } = data;

        if (!transactionHash) {
          throw new Error('Transaction hash not found in response');
        }

        // Update the withdrawal queue to mark it as completed
        const { error: statusUpdateError } = await supabase
          .from('withdrawal_queue')
          .update({ status: 'completed' })
          .eq('id', id);

        if (statusUpdateError) {
          await rollback(statusUpdateError);
          console.error('Status update error:', statusUpdateError);
          return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
        }

        // Add the withdrawal to the withdrawal_list table
        const { error: listError } = await supabase
          .from('withdrawal_list')
          .insert({
            user_id: userId,
            withdrawal_id: id,
            amount,
            transaction_hash: transactionHash, // Now using the transactionHash
            wallet_address,
          });

        if (listError) {
          await rollback(listError);
          console.error('Withdrawal list insert error:', listError);
          return NextResponse.json({ error: 'Failed to insert into withdrawal_list' }, { status: 500 });
        }

      } catch (withdrawalError) {
        await rollback(withdrawalError);
        console.error('Withdrawal processing error:', withdrawalError);
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
