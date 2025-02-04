'use client';

import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';
import { Users, Copy, Gift, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import BottomNav from '@/lib/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

type Referral = {
  referee_id: string;
  status: string;
  reward_amount: number;
};

export default function Referrals() {
  const router = useRouter();
  const user: any = useCurrentUser();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t: any = useTranslations('invite');
  const [userData, setUserData] = useState({
    referral_id: 0,refferal_number:0
  });
  const supabase =createClient();

  
  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('referral_id,refferal_number')
          .eq('id', user.supabaseId)
          .single();
  
        if (error) throw error;
  
        if (data) {
        setUserData({ referral_id: data.referral_id || null, refferal_number:data.refferal_number });        }
      } catch (err) {
        console.error('Error fetching profit:', err);
        setError(t('errors.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, t]);

  // Fetch referrals based on the user's referral ID
  useEffect(() => {
    if (!userData.referral_id) return;  // No referral_id available

    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('referee_id, status, reward_amount')
          .eq('referrer_id', userData.referral_id);

        if (error) {
          console.error('Error fetching referrals:', error);
          return;
        }

        if (data) {
          setReferrals(data);
          setTotalReferrals(user.refferal_number);
        }
      } catch (error) {
        console.error('Unexpected error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [userData.referral_id]);

  const copyReferralLink = () => {
    if (userData.referral_id) {
      navigator.clipboard.writeText(`${userData.referral_id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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
            <h1 className="text-2xl text-primary font-bold">Referral Program</h1>
          </div>
        </div>

        {/* Referral Overview */}
        <div className="bg-blue-900/50 backdrop-blur-md p-6 mb-8 rounded-2xl border border-blue-700/50 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Invite Friends</h2>
          <p className="text-muted-foreground text-center">
            Share your referral code and earn rewards for each friend who joins!
          </p>
        </div>

        {/* Referral ID Section */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50">
          <h2 className="text-lg font-semibold text-primary mb-4">Your Referral ID</h2>
          <div className="flex items-center justify-between bg-background/30 p-4 rounded-xl border border-blue-700/50">
            <code className="text-primary text-lg">
              {userData.referral_id || 'N/A'}
            </code>
            <button 
              onClick={copyReferralLink}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Your Referrals ({totalReferrals})
          </h2>
          
          {totalReferrals > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-700/50">
                    <th className="text-left p-4 text-sm text-muted-foreground">Referee ID</th>
                    <th className="text-left p-4 text-sm text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm text-muted-foreground">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral, index) => (
                    <tr key={index} className="border-b border-blue-700/50">
                      <td className="p-4 text-primary">{referral.referee_id}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          referral.status === 'completed' 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="p-4 text-green-400">${referral.reward_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <Users className="mx-auto w-16 h-16 mb-4 opacity-50" />
              <p>You haven't referred anyone yet. Start inviting friends!</p>
            </div>
          )}
        </div>

        {/* How to Refer Section */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-20 border border-blue-700/50">
          <h3 className="text-lg font-semibold text-primary mb-4">How to Refer</h3>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center text-primary">1</div>
              <span>Copy your unique referral ID</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center text-primary">2</div>
              <span>Share with friends</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center text-primary">3</div>
              <span>Earn rewards when they sign up</span>
            </li>
          </ol>
        </div>

        <div style={{ height: '100px' }}></div>

      </div>
          
      <BottomNav />
    </div>
  );
}