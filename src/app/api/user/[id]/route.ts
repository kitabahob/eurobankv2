import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// Define the correct params interface for Next.js route handlers
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('id', params.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}