'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Network, 
  CreditCard,
  RefreshCw,
  ChevronLeft
} from 'lucide-react';

interface ErrorReason {
  icon: React.ReactNode;
  title: string;
  reasons: string[];
}

export default function DepositErrorReasons() {
  const router = useRouter();

  const errorReasons: ErrorReason[] = [
    {
      icon: <Lock className="w-6 h-6 text-red-400" />,
      title: "Authentication Issues",
      reasons: [
        "Incorrect or expired login credentials",
        "Account temporarily suspended",
        "Two-factor authentication issues",
        "Account verification not completed"
      ]
    },
    {
      icon: <Network className="w-6 h-6 text-yellow-400" />,
      title: "Network and Connection Problems",
      reasons: [
        "Unstable internet connection",
        "Temporary server unavailability", 
        "Firewall or security settings blocking connection",
        "VPN or proxy interference"
      ]
    },
    
    {
      icon: <RefreshCw className="w-6 h-6 text-green-400" />,
      title: "Transaction State Conflicts",
      reasons: [
        "Pending deposit already in progress",
        "Recent transaction not yet processed",
        "Conflicting transaction in system",
        "Deposit queue is full"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
       {/* Header */}
       <div className="bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl text-primary font-bold">Deposit Error</h1>
          </div>
        </div>

        {/* Error Reasons Container */}
        <div className="space-y-6">
          {errorReasons.map((reason, index) => (
            <div 
              key={index} 
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 rounded-full bg-white dark:bg-gray-700">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{reason.title}</h3>
              </div>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 pl-4 list-disc">
                {reason.reasons.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you continue experiencing issues, please contact our support team with the specific error details.
          </p>
          <button 
            onClick={() => router.push('/support')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}