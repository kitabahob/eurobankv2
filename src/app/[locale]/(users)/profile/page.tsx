'use client'
import React, { useState } from 'react';
import { logout } from '@/lib/auth/auth';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Settings, 
  LogOut, 
  Copy,
  RefreshCw,
  Star,
  Trophy,
  Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/lib/components/BottomNav';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: 'CryptoTrader123',
    email: 'cryptotrader123@eurobank.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'January 2023',
    referralCode: 'EURO2024XYZ',
    level: 3,
    totalReferrals: 12,
    accountStatus: 'Active'
  });

  const router = useRouter();

  // Profile action sections
  const profileActions = [
    { 
      icon: Shield, 
      label: 'Security', 
      color: 'text-blue-400',
      action: () => router.push('/security')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      color: 'text-green-400',
      action: () => router.push('/settings')
    },
    { 
      icon: LogOut, 
      label: 'Logout', 
      color: 'text-red-400',
      action: () => logout()
    }
  ];

  // Achievements and stats
  const profileStats = [
    { 
      icon: Star, 
      label: 'Level', 
      value: userData.level,
      color: 'text-yellow-400'
    },
    { 
      icon: Trophy, 
      label: 'Referrals', 
      value: userData.totalReferrals,
      color: 'text-blue-400'
    },
    { 
      icon: Layers, 
      label: 'Status', 
      value: userData.accountStatus,
      color: 'text-green-400'
    }
  ];

  // Copy to clipboard function
  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile & Desktop View */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="text-muted-foreground hover:text-primary"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="text-2xl text-primary font-bold">Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>

        {/* Profile Overview */}
        <div className="bg-blue-900/50 backdrop-blur-md p-6 mb-8 rounded-2xl border border-blue-700/50 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{userData.username}</h2>
          <p className="text-muted-foreground">Member since {userData.memberSince}</p>
        </div>

        {/* Contact Information */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50 space-y-4">
          <h3 className="text-xl font-semibold text-primary mb-4">Contact Information</h3>
          {[
            { 
              icon: Mail, 
              label: 'Email', 
              value: userData.email,
              color: 'text-blue-400'
            },
            { 
              icon: Phone, 
              label: 'Phone', 
              value: userData.phone,
              color: 'text-green-400'
            },
            { 
              icon: CreditCard, 
              label: 'Referral Code', 
              value: userData.referralCode,
              color: 'text-yellow-400',
              copyable: true
            }
          ].map(({ icon: Icon, label, value, color, copyable }, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-background/30 p-3 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className={`${color} p-2 rounded-full bg-secondary`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium text-primary">{value}</p>
                </div>
              </div>
              {copyable && (
                <Copy 
                  className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary"
                  onClick={() => copyToClipboard(value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {profileStats.map(({ icon: Icon, label, value, color }, index) => (
            <div 
              key={index}
              className="bg-blue-800/50 backdrop-blur-md rounded-2xl p-4 border border-blue-700/50 flex flex-col items-center"
            >
              <Icon className={`${color} w-10 h-10 mb-2`} />
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Profile Actions */}
        <div className="grid grid-cols-3 gap-4">
          {profileActions.map(({ icon: Icon, label, color, action }, index) => (
            <div 
              key={index}
              className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 border border-blue-700/50 shadow-xl hover:bg-blue-700/50 transition-all cursor-pointer"
              onClick={action}
            >
              <div className="flex flex-col items-center">
                <Icon className={`${color} w-12 h-12 mb-4`} />
                <h3 className="text-lg font-semibold">{label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav/>

    </div>
  );
};

export default ProfilePage;