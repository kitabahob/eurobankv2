import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import axios from 'axios';

interface Deposit {
  id: number;
  wallet_address: string;
  amount: number;
  status: string;
  created_at: string;
}

interface SupabasePayload {
  new: Deposit;
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

let blockchainListenerActive = false;

const PERSONAL_WALLET_ADDRESS = 'TSrqBqNgsUVHkjBcZc2GEDHTCUdPszgoQt'; // Your wallet address

async function fetchTransactionsFromTronGrid(startTime: number, endTime: number) {
  try {
    const response = await axios.get(
      `https://api.trongrid.io/v1/accounts/${PERSONAL_WALLET_ADDRESS}/transactions/trc20?only_confirmed=true&limit=100&min_timestamp=${startTime}&max_timestamp=${endTime}`
    );
    return response.data.data; // Return the transactions array
  } catch (error) {
    console.error('Error fetching transactions from TronGrid:', error);
    return [];
  }
}

async function getStartFilterTime(): Promise<number | null> {
  try {
    // Query the database for the oldest pending deposit
    const { data: oldestPending } = await supabase
      .from('deposits')
      .select('created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1);

    if (oldestPending && oldestPending.length > 0) {
      const oldestCreatedAt = oldestPending[0].created_at;
      // Convert to a Unix timestamp in milliseconds
      return new Date(oldestCreatedAt).getTime();
    }
    return null; // No pending deposits found
  } catch (error) {
    console.error('Error fetching oldest pending deposit:', error);
    return null;
  }
}

async function listenToBlockchainTransactions() {
  try {
    // Get the current time in Unix timestamp (milliseconds)
    const currentTime = Date.now();

    // Get the start filter time
    const startTime = await getStartFilterTime();

    if (!startTime) {
      console.log('No oldest pending deposit found. Skipping blockchain listener.');
      return;
    }

    // Fetch USDT TRC20 transactions for the personal wallet address within the time range
    const transactions = await fetchTransactionsFromTronGrid(startTime, currentTime);

    if (transactions.length === 0) {
      console.log('No transactions found for the given time range.');
      return;
    }

    console.log('Transactions fetched from TronGrid:', transactions);

    for (const tx of transactions) {
      // Check if transaction matches USDT criteria
      if (
        tx.token_info.symbol === 'USDT' &&
        tx.token_info.address === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' &&
        tx.to === PERSONAL_WALLET_ADDRESS
      ) {
        const transactionAmount = parseFloat(tx.value) / 1_000_000;

        // Check for a matching pending deposit in the database
        const { data: matchedDeposits, error } = await supabase
          .from('deposits')
          .select('*')
          .eq('wallet_address', tx.to)
          .eq('status', 'pending')
          .eq('amount', transactionAmount);

        if (error) {
          console.error('Error querying deposits table:', error);
          continue;
        }

        if (matchedDeposits && matchedDeposits.length > 0) {
          const matchedDeposit = matchedDeposits[0];

          // Update the matched deposit record in the database
          const { error: updateError } = await supabase
            .from('deposits')
            .update({
              status: 'completed',
              transaction_hash: tx.transaction_id
            })
            .eq('id', matchedDeposit.id);

          if (updateError) {
            console.error('Error updating deposit status:', updateError);
          } else {
            console.log('Deposit updated successfully:', matchedDeposit);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in blockchain transaction listener:', error);
  }
}

async function startBlockchainListener() {
  console.log('Blockchain listener started.');

  const interval = setInterval(async () => {
    const { data: pendingDeposits } = await supabase
      .from('deposits')
      .select('*')
      .eq('status', 'pending');

    if (!pendingDeposits || pendingDeposits.length === 0) {
      console.log('No pending deposits. Stopping blockchain listener.');
      blockchainListenerActive = false;
      clearInterval(interval);
      return;
    }

    await listenToBlockchainTransactions();
  }, 5000);
}

async function startSupabaseListener() {
  const channel: RealtimeChannel = supabase.channel('deposits-status-pending');

  channel
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'deposits',
      filter: 'status=eq.pending',
    }, (payload: SupabasePayload) => {
      const deposit = payload.new;

      console.log('New pending deposit detected:', deposit);
      if (!blockchainListenerActive) {
        blockchainListenerActive = true;
        startBlockchainListener();
      }
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Supabase listener for pending deposits is active.');
      }
    });
}

// Start the Supabase listener when the service is initialized
startSupabaseListener();
