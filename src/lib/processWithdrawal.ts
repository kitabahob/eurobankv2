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
    recvWindow? : number;
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
    chain = 'TRC20'
): Promise<{ transactionHash: string }> {
    // Log the input parameters
    

    try {
        // Validate TRC20 wallet address
        const trc20AddressRegex = /^T[a-zA-Z0-9]{33}$/;
        if (!trc20AddressRegex.test(walletAddress)) {
            throw new Error('Invalid TRC20 wallet address');
        }

        if (amount <= 0.1) {
            throw new Error('Withdrawal amount must be greater than 0.1');
        }

        const amountStr = amount.toString();

        
        // Get the current timestamp in milliseconds
        const timestamp = Date.now();

        // Adjust the timestamp by adding 13 seconds (13000 milliseconds)
        const adjustedTimestamp = timestamp + 1500; 
        
        // Make the API call
        const response = await bybitClient.submitWithdrawal({
            coin,
            chain,
            address: walletAddress,
            amount: '10',
            timestamp:adjustedTimestamp,
            forceChain: 0,
            accountType: 'FUND',
            
        });

        console.log('Adjusted timestamp:'+ adjustedTimestamp)

        // Log the API response
        console.log('Bybit API response:', response);

        if (response.retCode !== 0) {
            console.error("Bybit API Error details:", response);
            throw new Error(`Bybit API Error ${response.retCode}: ${response.retMsg}`);
        }

        return { 
            transactionHash: response.result.id 
        };

    } catch (error) {
        // Enhanced error logging
        console.error('Withdrawal error details:', {
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : error,
            params: {
                walletAddress,
                amount,
                coin,
                chain
            }
        });

        // Check for specific Bybit API errors
        if (error instanceof Error) {
            throw error;
        }

        // If we get here, something unexpected happened
        throw new Error('Unexpected error during withdrawal process');
    }
}