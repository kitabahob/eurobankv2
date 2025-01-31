import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { headers } from 'next/headers';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
    try {
      // Check if automatic processing is enabled
      const headersList = await headers();
      const host = headersList.get('host');
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const { data: automaticData, error: automaticError } = await supabase
        .from('automatic')
        .select('enabled')
        .eq('id', 1)
        .single();
  
      if (automaticError) {
        console.error('Error fetching automatic processing state:', automaticError);
        return NextResponse.json({ error: 'Failed to check automatic processing state' }, { status: 500 });
      }
  
      if (!automaticData?.enabled) {
        console.log('Automatic processing is disabled');
        return NextResponse.json({ message: 'Automatic processing is disabled' });
      }
  
      // Calculate the date 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
      // Fetch pending withdrawals from Supabase that are 3 days old or older
      const { data: withdrawals, error } = await supabase
        .from('withdrawal_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('created_at', threeDaysAgo.toISOString())
        .order('created_at', { ascending: true })
        .limit(50);
  
      if (error) {
        throw new Error('Failed to fetch withdrawals');
      }
  
      const results = [];
  
      // Process each withdrawal with a delay between calls
      for (const withdrawal of withdrawals) {
        try {
          // Add a 2-second delay between each API call
          await delay(2000);
  
          const response = await fetch('https://eurobankv2.vercel.app/api/bitget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: withdrawal.amount,
              walletAddress: withdrawal.wallet_address,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Bitget API error: ${response.statusText}`);
          }
  
          const result = await response.json();
  
          if (!result.transactionHash) {
            throw new Error('Transaction hash not found in Bitget API response');
          }
  
  
          // Update withdrawal status in Supabase
          const { error: updateError } = await supabase
            .from('withdrawal_queue')
            .update({ status: 'completed' })
            .eq('id', withdrawal.id);
  
          if (updateError) {
            throw new Error(`Failed to update withdrawal status: ${updateError.message}`);
          }
  
          // Add the withdrawal to the withdrawal_list table
          const { error: insertError } = await supabase
            .from('withdrawal_list')
            .insert({
              user_id: withdrawal.user_id,
              withdrawal_id: withdrawal.id,
              amount: withdrawal.amount,
              transaction_hash: result.transactionHash,
              wallet_address: withdrawal.wallet_address,
            });
  
          if (insertError) {
            throw new Error(`Failed to insert into withdrawal_list: ${insertError.message}`);
          }
  
          results.push({ 
            id: withdrawal.id, 
            status: 'completed', 
            transactionHash: result.transactionHash,
            created_at: withdrawal.created_at
          });
        } catch (error) {
          console.error(`Error processing withdrawal ${withdrawal.id}:`, error);
  
          // Update withdrawal reason in Supabase, keeping status as 'pending'
          await supabase
            .from('withdrawal_queue')
            .update({ 
              reason: error instanceof Error ? error.message : 'Unknown error' 
            })
            .eq('id', withdrawal.id);
  
          results.push({ 
            id: withdrawal.id, 
            status: 'pending', 
            error: error instanceof Error ? error.message : 'Unknown error',
            created_at: withdrawal.created_at
          });
        }
      }
  
      return NextResponse.json({ results });
    } catch (error) {
      console.error('Error in GET function:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  