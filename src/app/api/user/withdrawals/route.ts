import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('withdrawal_queue')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }

  return NextResponse.json({ withdrawals: data });
}
