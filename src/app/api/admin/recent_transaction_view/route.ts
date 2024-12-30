import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data, error } = await supabase
    .from('deposits_withdrawals')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(50);



  if (error) {
    return NextResponse.json({ error: 'Failed to fetch recent transactions' }, { status: 500 });
  }

  return NextResponse.json({ recent: data });
}
