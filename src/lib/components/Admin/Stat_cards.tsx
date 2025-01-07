import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface StatData {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: 'users' | 'wallet' | 'deposit' | 'withdrawal';
  bgColor: string;
}

interface StatsCardProps {
  stat: StatData;
}

const iconMap = {
  users: { icon: Users, color: 'text-green-400', bg: 'bg-green-900' },
  wallet: { icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-900' },
  deposit: { icon: ArrowDownCircle, color: 'text-purple-400', bg: 'bg-purple-900' },
  withdrawal: { icon: ArrowUpCircle, color: 'text-red-400', bg: 'bg-red-900' },
};

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  const IconComponent = iconMap[stat.icon].icon;
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 ${iconMap[stat.icon].bg} rounded-lg`}>
          <IconComponent className={`w-6 h-6 ${iconMap[stat.icon].color}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-400 text-sm">{stat.title}</h3>
          <p className="text-2xl font-semibold text-white">
            {typeof stat.value === 'number' && stat.title.includes('Amount') ? `$${stat.value}` : stat.value}
          </p>
          {stat.trend && (
            <span className={`${stat.trend.isPositive ? 'text-green-400' : 'text-red-400'} text-sm flex items-center`}>
              {stat.trend.isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {stat.trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;