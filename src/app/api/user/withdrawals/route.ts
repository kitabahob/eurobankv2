import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';




export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('withdrawal_queue')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ withdrawals: data });
  } catch (err) {
    const errorMessage = (err as Error).message || 'An unknown error occurred';

    console.error('Unexpected Error:', errorMessage);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
