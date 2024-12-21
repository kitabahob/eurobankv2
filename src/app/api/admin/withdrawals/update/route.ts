import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { processWithdrawal } from '@/lib/processWithdrawal';

// Define input type for better type safety
interface WithdrawalStatusInput {
  id: string;
  status: 'pending' | 'delayed' | 'canceled' | 'completed';
  reason?: string;
  userId: string;
  amount: number;
  wallet_address:string;
}

export async function POST(request: Request) {
  try {
    const { id, status, reason, userId, amount,wallet_address} = await request.json() as WithdrawalStatusInput;

    // input validation
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
      // // Get the user's last used wallet address from the deposit table
      // const { data: deposit, error: depositError } = await supabase
      //   .from('deposit')
      //   .select('wallet_address')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false })
      //   .limit(1)
      //   .single();

      // if (depositError || !deposit) {
      //   await rollback(depositError);
      //   console.error('Wallet address fetch error:', depositError);
      //   return NextResponse.json({ error: 'Failed to fetch wallet address' }, { status: 500 });
      // }

      const walletAddress = wallet_address;

      try {
        // Process actual withdrawal using Bybit API
        const { transactionHash } = await processWithdrawal(
          walletAddress, 
          amount
        );

        // Add the withdrawal to the withdrawal_list table
        const { error: listError } = await supabase
          .from('withdrawal_list')
          .insert({
            user_id: userId,
            withdrawal_id: id,
            amount,
            transaction_hash: transactionHash,
            wallet_address: walletAddress,
          });

        if (listError) {
          await rollback(listError);
          console.error('Withdrawal list insert error:', listError);
          return NextResponse.json({ error: 'Failed to insert into withdrawal_list' }, { status: 500 });
        }

      } catch (withdrawalError) {
        await rollback(withdrawalError);
        console.error('Bybit withdrawal error:', withdrawalError);
        return NextResponse.json({ 
          error: 'Failed to process withdrawal through Bybit', 
          details: (withdrawalError as Error).message 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Withdrawal status updated successfully' });

  } catch (error) {
    console.error('Unexpected error in withdrawal handler:', error);
    return NextResponse.json({ 
      error: 'Unexpected error processing withdrawal', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}