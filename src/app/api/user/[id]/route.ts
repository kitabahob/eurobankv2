import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  
  const { id } = await params;  


  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
