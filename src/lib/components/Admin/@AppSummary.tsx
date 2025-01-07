import React, { useState, useEffect } from 'react';
import StatsCard from './Stat_cards';

interface AppSummaryData {
  recent: {
    total_users: number;
    total_deposit: number;
    total_deposit_amount: number;
    total_withdrawal: number;
    total_withdrawal_amount: number;
  };
}

const StatsGrid: React.FC = () => {
  const [summaryData, setSummaryData] = useState<AppSummaryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/app_summary');
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: 'Total Users',
      value: summaryData.recent.total_users,
      icon: 'users' as const,
      bgColor: 'bg-green-900',
    },
    {
      title: 'Total Deposits Amount',
      value: summaryData.recent.total_deposit_amount,
      trend: {
        value: `${summaryData.recent.total_deposit} transactions`,
        isPositive: true,
      },
      icon: 'deposit' as const,
      bgColor: 'bg-purple-900',
    },
    {
      title: 'Total Withdrawals Amount',
      value: summaryData.recent.total_withdrawal_amount,
      trend: {
        value: `${summaryData.recent.total_withdrawal} transactions`,
        isPositive: false,
      },
      icon: 'withdrawal' as const,
      bgColor: 'bg-red-900',
    },
    {
      title: 'Average Transaction',
      value: `$${(
        (summaryData.recent.total_deposit_amount +
          summaryData.recent.total_withdrawal_amount) /
        (summaryData.recent.total_deposit +
          summaryData.recent.total_withdrawal)
      ).toFixed(2)}`,
      icon: 'wallet' as const,
      bgColor: 'bg-blue-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
