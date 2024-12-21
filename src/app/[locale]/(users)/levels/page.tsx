'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BackNavHeader from '@/lib/components/Backnav';

interface LevelInfo {
  level: number;
  dailyProfit: string;
  deposit: string;
}

const levels: LevelInfo[] = [
    { level: 1, dailyProfit: "$1.20", deposit: "$60" },
    { level: 2, dailyProfit: "$2.00", deposit: "$100" },
    { level: 3, dailyProfit: "$4.00", deposit: "$200" },
    { level: 4, dailyProfit: "$8.00", deposit: "$400" },
    { level: 5, dailyProfit: "$10.00", deposit: "$500" },
    { level: 6, dailyProfit: "$20.00", deposit: "$1,000" },
    { level: 7, dailyProfit: "$40.00", deposit: "$2,000" },
    { level: 8, dailyProfit: "$100.00", deposit: "$5,000" },
    { level: 9, dailyProfit: "$200.00", deposit: "$10,000" },
    { level: 10, dailyProfit: "$300.00", deposit: "$15,000" },
  ];
  
export default function LevelsGrid() {
    const router = useRouter();

    const navigateToDeposit = () => {
      router.push('/deposit');
    };
  



  return ( 
    <>
    
    <BackNavHeader/>
    <div className="min-h-screen bg-blue py-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-white-600 md:text-3xl">Our investment Scheme</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {levels.map((level) => (
          <div
          onClick={navigateToDeposit}
            key={level.level}
            className="bg-secondary shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow hover:bg-blue-700/50"
          >
            <h2 className="text-xl font-bold text-blue-600">Level {level.level}</h2>
            <p className="text-green-700 mt-4">
              <span className="font-semibold">Daily Profit:</span> {level.dailyProfit}
            </p>
            <p className="text--700 mt-2">
              <span className="font-semibold">Deposit:</span> {level.deposit}
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
