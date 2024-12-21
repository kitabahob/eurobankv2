import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { z } from 'zod';

// Zod schema for input validation
const WithdrawalSchema = z.object({
  user_id: z.string(),
  amount: z.number().positive(),
  address: z.string().regex(
    /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    { message: "Invalid TRC20 USDT wallet address" }
  )
});

export async function POST(request: Request) {
  try {
    // Parse and validate input
    const requestData = await request.json();
    const { user_id, amount, address } = WithdrawalSchema.parse(requestData);

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_dp, amount_withdrawn, profit_balance, ref_profit')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if withdrawal is allowed
    const { total_dp, amount_withdrawn, profit_balance, ref_profit } = user;
    if (total_dp < (profit_balance - ref_profit)) {
      return NextResponse.json({ error: 'Withdrawal criteria not met' }, { status: 400 });
    }

    // Check for existing pending withdrawal requests
    const { data: pendingRequest, error: pendingError } = await supabase
      .from('withdrawal_queue')
      .select('id')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .single();

    if (pendingError) {
      console.error('Error checking pending withdrawals:', pendingError);
      return NextResponse.json({ error: 'You have pending withdrawal requests' }, { status: 500 });
    }

    if (pendingRequest) {
      return NextResponse.json({ error: 'You have a previous pending request' }, { status: 400 });
    }

    // Update user table with new withdrawal
    const newAmountWithdrawn = amount_withdrawn + amount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ amount_withdrawn: newAmountWithdrawn })
      .eq('id', user_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
    }

    // Insert withdrawal details into the withdrawal_queue table
    const { error: insertError } = await supabase
      .from('withdrawal_queue')
      .insert([{ 
        user_id: user_id, 
        amount: amount, 
        wallet_address: address 
      }]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to add withdrawal request' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Withdrawal request processed successfully' });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: error.errors[0].message 
      }, { status: 400 });
    }

    // Handle other unexpected errors
    console.error('Unexpected error in withdrawal:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
