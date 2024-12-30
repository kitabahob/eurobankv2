'use client'
import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  LineChart, 
  Wallet,
  Bell,
  Search,
  Menu,
  Shield,
  Settings
} from 'lucide-react';

import RecentTransactionsTable from '@/lib/components/Admin/Recent_transactions';
const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Crypto Admin</h1>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <a href="#" className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg">
              <LayoutGrid className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Users
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <LineChart className="w-5 h-5 mr-3" />
              Trading
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <Wallet className="w-5 h-5 mr-3" />
              Wallets
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <Shield className="w-5 h-5 mr-3" />
              Security
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <button className="md:hidden p-2 text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center flex-1 px-4">
              <div className="max-w-md w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search transactions, users..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button className="p-2 relative text-gray-300">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-900">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Stats Cards go here */}
          </div>

          {/* Recent Transactions Table Component */}
          <RecentTransactionsTable />
          
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
