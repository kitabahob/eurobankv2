import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data, error } = await supabase
    .from('withdrawal_queue')
    .select('*')
    .eq('status', 'pending');

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }

  return NextResponse.json({ withdrawals: data });
}
