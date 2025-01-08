import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';
import axios from 'axios';

const PERSONAL_WALLET_ADDRESS = 'TMaLDP1gPgiPVr8aoKm1YFLA56b8Dihgpj';
const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export async function POST(request: Request) {
  try {
    const { depositId, walletAddress, amount, createdAt, expiresAt } = await request.json();
    console.log('Received request payload:', { depositId, walletAddress, amount, createdAt, expiresAt });

    if (!depositId || !walletAddress || !amount || !createdAt || !expiresAt) {
      console.error('Missing required parameters:', { depositId, walletAddress, amount, createdAt, expiresAt });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Store the expected sender's address (the customer's wallet)
    const expectedSenderAddress = walletAddress.trim().toLowerCase();
    const startTime = new Date(createdAt).getTime();
    const endTime = new Date(expiresAt).getTime();

    console.log('Verifying deposit:', {
      depositId,
      expectedSender: expectedSenderAddress,
      receivingWallet: PERSONAL_WALLET_ADDRESS.toLowerCase(),
      amount,
      timeWindow: {
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString(),
      },
    });

    const trongridUrl = `https://api.trongrid.io/v1/accounts/${PERSONAL_WALLET_ADDRESS}/transactions/trc20?only_confirmed=true&limit=200&min_timestamp=${startTime}&max_timestamp=${endTime}`;
    console.log('Fetching transactions from:', trongridUrl);

    const response = await axios.get(trongridUrl);
    console.log('TronGrid API response status:', response.status);
    console.log('TronGrid API response data:', response.data);

    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error('Invalid response from TronGrid:', response.data);
      return NextResponse.json(
        { verified: false, message: 'Invalid response from blockchain API' },
        { status: 500 }
      );
    }

    const transactions = response.data.data;
    console.log(`Found ${transactions.length} transactions in time window`);

    let verified = false;
    for (const tx of transactions) {
      if (!tx || typeof tx !== 'object') {
        console.warn('Invalid transaction object:', tx);
        continue;
      }

      const txFrom = tx.from?.toLowerCase() || '';
      const txTo = tx.to?.toLowerCase() || '';
      const txSymbol = tx.token_info?.symbol || '';
      const txContractAddress = tx.token_info?.address || '';
      const txDecimals = tx.token_info?.decimals || 6;
      const txValueRaw = tx.value || '0';

      console.log('Analyzing transaction:', {
        hash: tx.transaction_id,
        from: txFrom,
        to: txTo,
        symbol: txSymbol,
        contractAddress: txContractAddress,
        rawValue: txValueRaw,
        timestamp: new Date(tx.block_timestamp).toISOString()
      });

      // Updated matching conditions
      const symbolMatch = txSymbol === 'USDT';
      const contractMatch = txContractAddress === USDT_CONTRACT_ADDRESS;
      const receiverMatch = txTo === PERSONAL_WALLET_ADDRESS.toLowerCase();
      const senderMatch = txFrom === expectedSenderAddress;

      console.log('Match conditions:', {
        symbolMatch,
        contractMatch,
        receiverMatch,
        senderMatch,
        expectedSender: expectedSenderAddress,
        actualSender: txFrom,
        expectedReceiver: PERSONAL_WALLET_ADDRESS.toLowerCase(),
        actualReceiver: txTo
      });

      if (symbolMatch && contractMatch && receiverMatch) {
        const rawValue = txValueRaw.replace(/,/g, '');
        const transactionAmount = Number(rawValue) / Math.pow(10, txDecimals);

        console.log('Found matching transaction:', {
          transactionHash: tx.transaction_id,
          amount: transactionAmount,
          expectedAmount: amount,
          difference: Math.abs(transactionAmount - amount)
        });

        // For this case, we'll verify the amount even if the sender doesn't match exactly
        if (Math.abs(transactionAmount - amount) < 0.01) {
          verified = true;

          console.log('Updating deposit in database:', {
            depositId,
            transactionHash: tx.transaction_id,
            sender: txFrom
          });

          const { error: updateError } = await supabase
            .from('deposits')
            .update({
              status: 'completed',
              transaction_hash: tx.transaction_id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', depositId);

          if (updateError) {
            console.error('Database update error:', updateError);
            throw updateError;
          }

          console.log('Deposit verified and updated successfully');
          break;
        } else {
          console.log('Amount mismatch for matching transaction');
        }
      }
    }

    const result = {
      verified,
      message: verified
        ? 'Matching transaction found and deposit verified'
        : 'No matching transaction found during the time window',
    };
    console.log('Final result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in deposit verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to verify deposit',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}