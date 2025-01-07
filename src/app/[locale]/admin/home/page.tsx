'use client';
import React, { useEffect, useState } from 'react';
import { LayoutGrid, Wallet, Bell, LucideIcon } from 'lucide-react';
import DashboardPage from '@/lib/components/Admin/DashboardPage';
import WithdrawalsPage from '@/lib/components/Admin/WithdrawalPage';
import AnnouncementsPage from '@/lib/components/Admin/AnnouncementPage';
import { createClient } from '@/utils/supabase/client';
import { auth } from '@/firebase/config'; // Ensure correct import for Firebase auth

interface NavItem {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
}

const AdminDashboard: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<NavItem['id']>('dashboard');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser?.email) {
          console.error('No user logged in.');
          setIsAdmin(false);
          return;
        }

        const userEmail = currentUser.email;
        console.log(userEmail);

        // Query Supabase admin table
        const { data, error } = await supabase
          .from('Admin')
          .select('email')
          .eq('email', userEmail)
          .single();

        if (error) {
          console.error('Error querying Supabase:', error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(data ? true : false);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'withdrawals', icon: Wallet, label: 'Withdrawals' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
  ];

  const renderNavButton = (item: NavItem) => (
    <button
      key={item.id}
      className={`flex items-center px-4 py-2 ${
        selectedPage === item.id ? 'text-white bg-blue-600' : 'text-gray-300 hover:bg-gray-700'
      } rounded-lg w-full`}
      onClick={() => setSelectedPage(item.id)}
    >
      <item.icon className="w-5 h-5 md:mr-3" />
      <span className="hidden md:inline">{item.label}</span>
    </button>
  );

  const renderMobileNavButton = (item: NavItem) => (
    <button
      key={item.id}
      onClick={() => setSelectedPage(item.id)}
      className={`flex flex-col items-center py-3 px-4 flex-1 ${
        selectedPage === item.id ? 'text-blue-500' : 'text-gray-300'
      }`}
    >
      <item.icon className="w-6 h-6 mb-1" />
      <span className="text-xs">{item.label}</span>
    </button>
  );

  const getPageContent = (pageId: NavItem['id']) => {
    switch (pageId) {
      case 'dashboard':
        return <DashboardPage />;
      case 'withdrawals':
        return <WithdrawalsPage />;
      case 'announcements':
        return <AnnouncementsPage />;
    }
  };

  if (isAdmin === null) {
    return <div className="flex items-center justify-center h-screen text-white">Checking admin status...</div>;
  }

  if (isAdmin === false) {
    return <div className="flex items-center justify-center h-screen text-red-500">Access Denied. Admins only.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 md:flex-row">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block md:w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b flex items-center border-gray-700">
          <img src="/e.svg" alt="Admin" width={60} />
          <h1 className="text-xl font-bold text-white ml-2">Admin</h1>
        </div>
        <nav className="mt-6 p-4 space-y-1">
          {navItems.map(renderNavButton)}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center">
            <div className="md:hidden mr-4">
              <img src="/e.svg" alt="Admin" width={40} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-900 mb-16 md:mb-0">
          {getPageContent(selectedPage)}
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-around items-center px-2">
            {navItems.map(renderMobileNavButton)}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;