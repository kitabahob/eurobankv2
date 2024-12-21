import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { RestClientV5 } from 'bybit-api';
import axios from 'axios';

interface Deposit {
  id: number;
  wallet_address: string;
  amount: number;
  status: string;
}

interface SupabasePayload {
  new: Deposit; 
}

// Bybit and Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Bybit V5 API client
const bybitClient = new RestClientV5({
  testnet: process.env.BYBIT_TESTNET === 'true', // Optional: use environment variable to toggle
  key: process.env.BYBIT_API_KEY!,
  secret: process.env.BYBIT_API_SECRET!,
});

let blockchainListenerActive = false;

async function startSupabaseListener() {
  const channel: RealtimeChannel = supabase.channel('deposits-status-pending');

  channel
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'deposits', 
      filter: 'status=eq.pending' 
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

    for (const deposit of pendingDeposits) {
      await listenToBlockchainTransaction(deposit as Deposit);
    }
  }, 5000);
}

async function getTransactionDetailsFromTronscan(transactionHash: string) {
  try {
    const response = await axios.get(`https://api.tronscan.org/api/transaction/${transactionHash}`);
    
    // Validate transaction details
    const transactionData = response.data;
    
    // Check if it's a USDT TRC20 transaction
    if (
      transactionData.contract_type !== 'trc20' || 
      !transactionData.trc20TransferInfo ||
      transactionData.trc20TransferInfo[0]?.contract_address !== 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    ) {
      return null;
    }

    const transferInfo = transactionData.trc20TransferInfo[0];
    
    return {
      hash: transactionData.hash,
      fromAddress: transferInfo.from_address,
      toAddress: transferInfo.to_address,
      amount: parseFloat((parseInt(transferInfo.amount_str) / 1_000_000).toFixed(6))
    };
  } catch (error) {
    console.error('Error fetching transaction details from Tronscan:', error);
    return null;
  }
}

async function listenToBlockchainTransaction(deposit: Deposit) {
  try {
    // Fetch USDT TRC20 deposit records using Bybit V5 API
    const response = await bybitClient.getDepositRecords({
      coin: 'USDT',
    });

    //V5 API response
    const transactions = response.result.rows;

    for (const tx of transactions) {
      //check if chain is trc20
      if (tx.chain !== 'TRC20') continue;

      // Check if transaction amount matches deposit amount
      // Convert string amount to number and compare
      if (Math.abs(parseFloat(tx.amount) - deposit.amount) < 0.000001) {
        // Get detailed transaction info from Tronscan
        const transactionDetails = await getTransactionDetailsFromTronscan(tx.txID);

        if (transactionDetails) {
          // Check if sender address matches any wallet in Supabase
          const { data: matchedWallets } = await supabase
            .from('deposits')
            .select('*')
            .eq('wallet_address', transactionDetails.fromAddress)
            .eq('status', 'pending')
            .eq('amount', deposit.amount);

          if (matchedWallets && matchedWallets.length > 0) {
            // Update the matched record
            const { error } = await supabase
              .from('deposits')
              .update({ 
                status: 'completed', 
                transaction_hash: transactionDetails.hash,
                from_wallet: transactionDetails.fromAddress
              })
              .eq('id', matchedWallets[0].id);

            if (error) {
              console.error('Error updating deposit status:', error);
            } else {
              console.log('Deposit updated successfully:', matchedWallets[0]);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in blockchain transaction listener:', error);
  }
}

// Start the Supabase listener when the service is initialized
startSupabaseListener();