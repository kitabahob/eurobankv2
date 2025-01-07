import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  const { data, error } = await supabase
    .from('summary_view')
    .select('*')
    .single()
   



  if (error) {
    return NextResponse.json({ error: 'Failed to fetch recent transactions' }, { status: 500 });
  }

  return NextResponse.json({ recent: data });
}
