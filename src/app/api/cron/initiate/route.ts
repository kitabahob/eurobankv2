import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the process-withdrawals API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/cron/process-withdrawals`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ message: 'Cron job executed successfully', result });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};

