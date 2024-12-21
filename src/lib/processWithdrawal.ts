import bybitClient from "./bybitClient";

// Define the response type
interface BybitWithdrawalResponse {
    retCode: number;
    retMsg: string;
    result: {
      id: string;
    };
    retExtInfo?: Record<string, unknown>;
    time: number;
  }
  
  /**
   * Process withdrawal using Bybit API
   * @param walletAddress - Recipient's wallet address
   * @param amount - Amount to withdraw
   * @param coin - The coin to withdraw (default: 'USDT')
   * @param chain - Blockchain network (default: 'ETH')
   * @returns { transactionHash: string }
   */
  export async function processWithdrawal(
    walletAddress: string,
    amount: number,
    coin = 'USDT',
    chain = 'ETH'
  ): Promise<{ transactionHash: string }> {
    // Validate wallet address (basic regex example)
    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    if (!addressRegex.test(walletAddress)) {
      throw new Error('Invalid wallet address');
    }
  
    // Validate amount (example: minimum 0.1)
    if (amount <= 0.1) {
      throw new Error('Withdrawal amount must be greater than 0.1');
    }
  
    try {
      // Convert amount to string for Bybit API
      const amountStr = amount.toFixed(2); // Ensure 2 decimal places
  
      // Submit the withdrawal request using Bybit API
      const response: BybitWithdrawalResponse = await bybitClient.submitWithdrawal({
        coin,
        chain,
        address: walletAddress,
        amount: amountStr,
        forceChain: 0, // Set 0 or 1 based on your requirement
        accountType: 'FUND',
        timestamp: Date.now() // Use current timestamp
      });
  
      // Check for successful API response
      if (response.retCode !== 0) {
        throw new Error(`API Error: ${response.retMsg}`);
      }
  
      // Ensure result and id exist
      if (!response.result || !response.result.id) {
        throw new Error('No transaction ID found in API response');
      }
  
      // Extract transaction hash from the API response
      const transactionHash = response.result.id;
  
      return { transactionHash };
    } catch (error) {
      // More comprehensive error handling
      if (error instanceof Error) {
        console.error('Error processing withdrawal:', error.message);
        
        // Add more specific error handling based on error type
        if (error.message.includes('insufficient balance')) {
          throw new Error('Insufficient funds for withdrawal');
        }
        if (error.message.includes('invalid address')) {
          throw new Error('Invalid withdrawal address');
        }
      }
  
      // Fallback error
      throw new Error('Failed to process withdrawal');
    }
  }