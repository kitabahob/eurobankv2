'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';
import { Users, Copy, Gift } from 'lucide-react';

type Referral = {
  referee_id: string;
  status: string;
  reward_amount: number;
};

export default function Referrals() {
  const user = useCurrentUser();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user?.referral_id) return;

      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('referee_id, status, reward_amount')
          .eq('referrer_id', user.referral_id);

        if (error) {
          console.error('Error fetching referrals:', error);
          return;
        }

        if (data) {
          setReferrals(data);
          setTotalReferrals(data.length);
        }
      } catch (error) {
        console.error('Unexpected error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user]);

  const copyReferralLink = () => {
    if (user?.referral_id) {
      navigator.clipboard.writeText(`${user.referral_id}`);
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Referral Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center mb-2 text-prima">
              <Users className="mr-3" /> Referral Program
            </h1>
            <p className="text-blue-100">Invite friends and earn rewards!</p>
          </div>
          <Gift className="w-12 h-12 text-primary-300" />
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-accent-800/50 backdrop-blur-md border  border-blue-700/50 shadow-xl rounded-2xl p-4 flex items-center justify-between hover:bg-blue-700/50 transition-all cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Your Referral ID</h2>
            <div className="flex items-center">
              <code className="bg-gray-100 px-3 py-1 rounded mr-4 text-sm">
                {user?.referral_id || 'N/A'}
              </code>
              <button 
                // onClick={copyReferralLink}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : ''}`} />
              </button>
            </div>
            {copied && (
              <p className="text-green-500 text-sm mt-2">Referral link copied!</p>
            )}
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-blue shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Your Referrals ({totalReferrals})
          </h2>
        </div>

        {totalReferrals > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {['Referee ID', 'Status', 'Reward Amount'].map((header) => (
                    <th 
                      key={header} 
                      className="text-left p-4 text-xs uppercase text-gray-600 font-bold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr 
                    key={index} 
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm">{referral.referee_id}</td>
                    <td className="p-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs ${
                          referral.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-green-600">
                      ${referral.reward_amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <Users className="mx-auto w-16 h-16 mb-4 text-gray-300" />
            <p>You haven't referred anyone yet. Start inviting friends!</p>
          </div>
        )}
      </div>

      {/* Referral Instructions */}
      <div className="mt-8backdrop-blur-md border  border-blue-700/50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">How to Refer</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-2">
          <li>Copy your unique referral ID</li>
          <li>Share the link with friends</li>
          <li>Earn rewards when they sign up</li>
        </ol>
      </div>
    </div>
  );
}