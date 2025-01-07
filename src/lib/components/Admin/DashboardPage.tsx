import React from 'react';
import StatsGrid from '@/lib/components/Admin/@AppSummary';
import RecentTransactionsTable from '@/lib/components/Admin/@Recent_transactions';

const DashboardPage = () => {
  return (
    <>
      <StatsGrid />
      <RecentTransactionsTable />
    </>
  );
};

export default DashboardPage;
