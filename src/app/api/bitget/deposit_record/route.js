import { getDepositRecords } from '../../../utils/bitgetApi';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const params = {
      startTime: searchParams.get('startTime'),
      endTime: searchParams.get('endTime'),
      coin: searchParams.get('coin'),
      limit: searchParams.get('limit')
    };

    const deposits = await getDepositRecords(params);
    return NextResponse.json(deposits);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Failed to fetch deposits', error: error.message },
      { status: 500 }
    );
  }
}




