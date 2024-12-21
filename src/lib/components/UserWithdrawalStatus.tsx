'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';
import { useRouter } from 'next/navigation';

// Define the type for a withdrawal
interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'delayed' | 'canceled' | 'completed';
  reason?: string; // Reason is optional
}

export default function UserWithdrawalStatus() {
  const user = useCurrentUser();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const toWithdrawal = () => {
    router.push('/withdrawal');
  };

  const fetchWithdrawals = async () => {
    if (!user?.id) return;

    const res = await fetch(`/api/user/withdrawals?user_id=${user.id}`);
    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setWithdrawals(data.withdrawals); // Assuming `data.withdrawals` is an array of `Withdrawal`
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col align-middle items-center p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Your Withdrawals</h1>

      {error && (
        <p className="text-red-500 bg-red-800/50 p-4 rounded-lg mb-4">{error}</p>
      )}

      {withdrawals.length === 0 ? (
        <p className="text-muted-foreground">You have no withdrawal records.</p>
      ) : (
        <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
          <table className="w-full bg-secondary text-primary text-left">
            <thead className="bg-primary/20">
              <tr>
                <th className="px-6 py-3 text-sm font-bold">Amount</th>
                <th className="px-6 py-3 text-sm font-bold">Status</th>
                <th className="px-6 py-3 text-sm font-bold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-secondary/50 transition-colors duration-200"
                >
                  <td className="px-6 py-3">{`$${w.amount.toFixed(2)}`}</td>
                  <td
                    className={`px-6 py-3 font-medium ${
                      w.status === 'completed'
                        ? 'text-green-500'
                        : w.status === 'pending'
                        ? 'text-yellow-500'
                        : w.status === 'delayed'
                        ? 'text-orange-500'
                        : 'text-red-500'
                    }`}
                  >
                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                  </td>
                  <td className="px-6 py-3">
                    {w.reason ? w.reason : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className='h-80' pt-30>
      <button
        onClick={toWithdrawal}
        className="mt-8 px-6 py-3 bg-secondary  text-white font-semibold rounded-lg shadow hover:bg-primary/80 transition-colors"
      >
        Initiate Withdrawal
      </button>

      </div>
      
    </div>
  );
}
