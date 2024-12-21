// src/app/deposit/status/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Deposit {
  id: number;
  created_at: string;
  user_id: string;
  wallet_address: string;
  amount: number;
  transaction_hash: string;
  updated_at: string;
  expires_at: string;
  status: string;
}

export default function DepositStatus() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/deposit/status');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.deposits)) {
          setDeposits(data.deposits);
        } else {
          throw new Error('Unexpected response format.');
        }
      } catch (error: any) {
        console.error('Failed to fetch deposit statuses:', error);
        setError(error.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Deposits</h1>
      {deposits.length === 0 ? (
        <p>No deposits found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Status</th>
              <th>Expires At</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id}>
                <td>{deposit.amount}</td>
                <td>{deposit.status}</td>
                <td>{new Date(deposit.expires_at).toLocaleString()}</td>
                <td>{deposit.transaction_hash || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
