'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing'; 
import { useCurrentUser } from '../auth/useCurrentUser';
import { Wallet, ArrowLeft, DollarSign } from 'lucide-react';
import BottomNav from '@/lib/components/BottomNav';
import { useTranslations } from 'next-intl'; 

export default function DepositPage() {
  const router = useRouter();
  const t = useTranslations('DepositPage'); 
  const [selectedAmount, setSelectedAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  
  const depositLevels = [
    { label: 'Level 1: $50', value: 50, dailyProfit: 1 },
    { label: 'Level 2: $100', value: 100, dailyProfit: 2 },
    { label: 'Level 3: $200', value: 200, dailyProfit: 4 },
    { label: 'Level 4: $400', value: 400, dailyProfit: 8 },
    { label: 'Level 5: $500', value: 500, dailyProfit: 10 },
    { label: 'Level 6: $1,000', value: 1000, dailyProfit: 20 },
    { label: 'Level 7: $2,000', value: 2000, dailyProfit: 40 },
    { label: 'Level 8: $5,000', value: 5000, dailyProfit: 100 },
    { label: 'Level 9: $10,000', value: 10000, dailyProfit: 200 },
    { label: 'Level 10: $15,000', value: 15000, dailyProfit: 300 },
  ];

  const initiateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedAmount) {
        throw new Error(t('pleaseSelectLevel')); // Use translation
      }

      if (!walletAddress || walletAddress.trim().length === 0) {
        throw new Error(t('pleaseEnterWalletAddress')); // Use translation
      }


      if (!user) {
        console.error('User not authenticated');
        return { error: 'User not authenticated' };
      }


      const response = await fetch('/api/deposit/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.supabaseId,
          amount: Number(selectedAmount),
          wallet_address: walletAddress.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/depositinfo');
      } else {
        sessionStorage.setItem('depositErrorMessage', data.message || t('depositFailed')); // Use translation
        router.push('/depositerror');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('unexpectedError'); // Use translation
      sessionStorage.setItem('depositErrorMessage', errorMessage);
      router.push('/depositerror');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl text-primary font-bold">{t('deposit')}</h1> {/* Translation for 'Deposit' */}
          </div>
        </div>

        {/* Deposit Overview */}
        <div className="bg-blue-900/50 backdrop-blur-md p-6 mb-8 rounded-2xl border border-blue-700/50 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{t('depositFunds')}</h2> {/* Translation for 'Deposit Funds' */}
          <p className="text-muted-foreground text-center">
            {t('chooseInvestment')} {/* Translation for description */}
          </p>
        </div>

        {/* Deposit Form */}
        <form onSubmit={initiateDeposit}>
          <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50 space-y-6">
            {/* Deposit Level Selection */}
            <div>
              <label
                htmlFor="depositLevel"
                className="block text-lg font-semibold text-primary mb-4"
              >
                {t('selectDepositLevel')} {/* Translation for label */}
              </label>
              <select
                id="depositLevel"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background/30 text-primary rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary border border-blue-700/50"
              >
                <option value="" disabled>{t('chooseLevel')}</option> {/* Translation for placeholder */}
                {depositLevels.map((level, index) => (
                  <option key={index} value={level.value}>
                    {`${level.label} (${t('dailyProfit')}: $${level.dailyProfit.toFixed(2)})`} {/* Translation for 'Daily Profit' */}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Address Input */}
            <div>
              <label
                htmlFor="walletAddress"
                className="block text-lg font-semibold text-primary mb-4"
              >
                {t('walletAddress')} {/* Translation for 'Wallet Address' */}
              </label>
              <div className="relative">
                <input
                  id="walletAddress"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-muted text-primary rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary border border-blue-700/50 pl-12"
                />
                <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl mb-9 flex items-center justify-center space-x-3 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span>{loading ? t('processing') : t('initiateDeposit')}</span> {/* Translations for button texts */}
          </button>
        </form>
      </div>
      
      <div className="bg-accent-800/50 text-red backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50 space-y-6">
        <h2 className="text-red">
          {t('disclaimer')} {/* Translation for disclaimer */}
        </h2>
        <div className="m-[200px]"></div>
      </div>

      <BottomNav />
    </div>
  );
}
