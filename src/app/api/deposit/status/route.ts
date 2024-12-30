import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Incoming GET request:', request.url);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id'); // Get user_id from query params
    console.log('Extracted userId:', userId);

    if (!userId) {
      console.warn('User ID is missing in the request');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Fetching deposits for userId:', userId);
    const { data: deposits, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deposits from database:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Fetched deposits:', deposits);
    return NextResponse.json({ deposits });
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
