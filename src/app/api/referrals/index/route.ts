import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { referralId } = await request.json();

    if (!referralId) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    // Query the referrals table for matches
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('referee_id, status, reward_amount')
      .eq('referrer_id', referralId);

    if (error) {
      console.error('Error fetching referrals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ referrals });
  } catch (error) {
    console.error('Error in referrals API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
