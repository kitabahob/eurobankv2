import React, { useState, useEffect } from 'react';

const RecentTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/recent_transaction_view');
        const data = await response.json();

        if (data.recent) {
          setTransactions(data.recent);
        } else {
          setError('No transactions found.');
        }
      } catch (err) {
        setError('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-4">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">User</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Asset</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Time</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-4">{transaction.user_email}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        transaction.transaction_type === 'deposit'
                          ? 'bg-green-900 text-green-400'
                          : transaction.transaction_type === 'withdrawal'
                          ? 'bg-red-900 text-red-400'
                          : 'bg-yellow-900 text-yellow-400'
                      }`}
                    >
                      {transaction.transaction_type.charAt(0).toUpperCase() +
                        transaction.transaction_type.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">${transaction.amount}</td>
                  <td className="py-4">USD</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        transaction.status === 'completed'
                          ? 'bg-blue-900 text-blue-400'
                          : 'bg-yellow-900 text-yellow-400'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">{new Date(transaction.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {transactions.map((transaction, index) => (
          <div key={index} className="p-4 border-b mb-1 border-gray-700">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">User</span>
                <span className="text-gray-300">{transaction.user_email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Type</span>
                <span
                  className={`px-2 py-1 rounded ${
                    transaction.transaction_type === 'deposit'
                      ? 'bg-green-900 text-green-400'
                      : transaction.transaction_type === 'withdrawal'
                      ? 'bg-red-900 text-red-400'
                      : 'bg-yellow-900 text-yellow-400'
                  }`}
                >
                  {transaction.transaction_type.charAt(0).toUpperCase() +
                    transaction.transaction_type.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-gray-300">${transaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset</span>
                <span className="text-gray-300">USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span
                  className={`px-2 py-1 rounded ${
                    transaction.status === 'completed'
                      ? 'bg-blue-900 text-blue-400'
                      : 'bg-yellow-900 text-yellow-400'
                  }`}
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span className="text-gray-300">
                  {new Date(transaction.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactionsTable;