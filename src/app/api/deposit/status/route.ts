import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: deposits, error } = await supabase
    .from('deposits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deposits });
}
