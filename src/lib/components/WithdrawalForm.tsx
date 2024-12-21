'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';
import { z } from 'zod';

// Zod schema for TRC20 USDT wallet address validation
const TRC20AddressSchema = z.string().regex(
  /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  { message: "Invalid TRC20 USDT wallet address" }
);

export default function WithdrawalForm() {
  const user = '4bd97305-6343-4b97-bb8f-1542128eec44';
  const [amount, setAmount] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUserProfit = async () => {
    if (!user) return;

    const response = await fetch(`/api/user/${user}`);
    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setTotalProfit(data.profit_balance);
    }
  };

  useEffect(() => {
    if (user) fetchUserProfit();
  }, [user]);

  const validateWalletAddress = (address: string) => {
    try {
      TRC20AddressSchema.parse(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous messages
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (amount <= 0) {
      setError('Invalid withdrawal amount');
      return;
    }

    if (amount>totalProfit){
      setError('Amount is greater than total balance')
    }

    if (!validateWalletAddress(walletAddress)) {
      setError('Invalid USDT TRC20 wallet address');
      return;
    }

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user, 
          amount, 
          address: walletAddress 
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Withdrawal request placed successfully!');
        fetchUserProfit(); // Refresh the profit balance
        
        // Reset form
        setAmount(0);
        setWalletAddress('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <form
        onSubmit={handleWithdraw}
        className="w-full max-w-md bg-blue-800/50 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-blue-700/50"
      >
        <h1 className="text-2xl font-bold text-primary mb-6">Make a Withdrawal</h1>

        {totalProfit !== null && (
          <p className="text-sm text-muted-foreground mb-4">
             Total balance: <span className="text-primary font-semibold">${totalProfit}</span>
          </p>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-800/50 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-lg bg-green-800/50 text-green-400">
            {success}
          </div>
        )}

        {/* Withdrawal Amount Input */}
        <div className="mb-4">
          <label
            htmlFor="withdrawAmount"
            className="block text-sm text-muted-foreground mb-2"
          >
            Enter Withdrawal Amount:
          </label>
          <input
            id="withdrawAmount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0"
            className="w-full px-4 py-2 bg-secondary text-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* USDT TRC20 Wallet Address Input */}
        <div className="mb-4">
          <label
            htmlFor="walletAddress"
            className="block text-sm text-muted-foreground mb-2"
          >
            USDT TRC20 Wallet Address:
          </label>
          <input
            id="walletAddress"
            type="text"
            placeholder="Enter TRC20 USDT wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full px-4 py-2 bg-secondary text-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Disclaimer */}
        <div className="mb-4 text-xs text-muted-foreground bg-yellow-800/20 p-3 rounded-lg">
          <strong>Disclaimer:</strong> You are responsible for verifying the accuracy of the USDT TRC20 wallet address. 
          We will not be held responsible for any losses or refunds resulting from incorrect wallet addresses 
          entered by the user.
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!user || totalProfit === null || !walletAddress}
          className={`w-full px-4 py-2 rounded-lg text-primary-foreground font-semibold shadow-md ${
            (totalProfit === null || !walletAddress) 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-600'
          }`}
        >
          {totalProfit === null ? 'Loading...' : 'Withdraw'}
        </button>
      </form>
    </div>
  );
}