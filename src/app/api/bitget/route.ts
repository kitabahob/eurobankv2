import { makeRequest } from "../../../utils/bitgetApi"; // Replace with your actual Bitget client import

/**
 * Process withdrawal using Bitget API
 * @param walletAddress - Recipient's wallet address
 * @param amount - Amount to withdraw
 * @param coin - The coin to withdraw (default: 'USDT')
 * @param chain - Blockchain network (default: 'TRC20')
 * @returns { transactionHash: string }
 */
export async function processWithdrawal(
  walletAddress: string,
  amount: number,
  coin = 'USDT',
  chain = 'TRC20'
): Promise<{ transactionHash: string }> {
  try {
    // Validate TRC20 wallet address
    const trc20AddressRegex = /^T[a-zA-Z0-9]{33}$/;
    if (!trc20AddressRegex.test(walletAddress)) {
      throw new Error('Invalid TRC20 wallet address');
    }

    if (amount <= 0.1) {
      throw new Error('Withdrawal amount must be greater than 0.1');
    }

    // Format the withdrawal request according to Bitget's API specifications
    const withdrawalData = {
      coin: coin.toUpperCase(),
      amount: amount.toString(),
      address: walletAddress,
      chain: chain.toUpperCase(),
    };

    console.log('Sending withdrawal request to Bitget:', withdrawalData);

    // Make the API call
    const response = await makeRequest(
      'POST',
      '/api/spot/v1/wallet/withdrawal', // Correct endpoint for Bitget API
      withdrawalData
    );

    console.log('Bitget API response:', response);

    if (response.code !== '00000') {
      throw new Error(`Bitget API Error ${response.code}: ${response.message}`);
    }

    return {
      transactionHash: response.data.id, // Adjust if the structure is different
    };
  } catch (error) {
    // Enhanced error logging
    console.error('Withdrawal error details:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      params: {
        walletAddress,
        amount,
        coin,
        chain,
      },
    });

    if (error instanceof Error) {
      throw new Error(error.message || 'Unexpected error during withdrawal process');
    } else {
      throw new Error('Unexpected error during withdrawal process');
    }
  }
}
