import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique 8-character referral ID using UUID.
 * @returns {string} Referral ID
 */
const generateReferralID = () => {
  return uuidv4().slice(0, 8).toUpperCase(); // Generate an 8-character unique referral ID
};

export async function POST(request: Request) {
  const { email, password, referralId } = await request.json();

  // Step 1: Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Failed to retrieve user ID after signup.' }, { status: 500 });
  }

  // Step 2: Generate a unique referral ID for the user
  const userReferralId = generateReferralID();

  // Step 3: Insert the user data into the `users` table
  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    referral_id: userReferralId,
    referred_by: referralId || null, // Store referral ID if provided
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to insert user data into the database.' }, { status: 500 });
  }

  // Step 4: Populate the referrals table if a referral ID was provided
  if (referralId) {
    const { error: referralError } = await supabase.from('referrals').insert({
      referrer_id: referralId,
      referee_id: userReferralId,
      status: 'pending',
    });

    if (referralError) {
      console.error('Failed to populate referrals table:', referralError);
      return NextResponse.json({ error: 'Referral tracking failed.' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Signup successful.', referralId: userReferralId });
}
