'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Lock, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  Star
} from 'lucide-react';
import BackNavHeader from '@/lib/components/Backnav';

const RulesSection = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const rulesSections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: BookOpen,
      content: [
        'Welcome to our cryptocurrency investment platform, designed to provide a secure and transparent investment experience.',
        'Our platform adheres to strict regulatory standards and prioritizes user safety and financial integrity.'
      ]
    },
    {
      id: 'investment-limits',
      title: 'Investment Limits',
      icon: Shield,
      content: [
        'Minimum Investment: $60',
        'Maximum Investment: $15,000 per transaction',
        'Daily Profit Limit: $300',
        'Monthly Investment Limit: $9,300'
      ]
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      icon: AlertTriangle,
      content: [
        'All investments carry inherent risks. Past performance does not guarantee future results.',
        'We recommend diversifying your investment portfolio.',
        'Never invest more than you can afford to lose.',
        'Conduct thorough research before making any investment decisions.'
      ]
    },
    {
      id: 'security-protocols',
      title: 'Security Protocols',
      icon: Lock,
      content: [
        'Authentication is mandatory',
        'All funds are stored in Secure wallets',
        'Regular security audits are conducted',
        'End-to-end encryption for all transactions'
      ]
    },
    {
      id: 'withdrawal-rules',
      title: 'Withdrawal Rules',
      icon: TrendingUp,
      content: [
        'Minimum Withdrawal: $60',
        'Withdrawal Processing Time: 1-3 Business Days',
        'Withdrawals are subject to  verification'
      ]
    },
    {
      id: 'compliance',
      title: 'Legal Compliance',
      icon: CheckCircle,
      content: [
        'Full compliance with international financial regulations',
        'Know Your Customer (KYC) procedures required',
        'Anti-Money Laundering (AML) policies strictly enforced',
        'Transparent reporting and tax documentation'
      ]
    }
  ];

  return (

    <>
     <BackNavHeader/>
    <div className="min-h-screen bg-blue text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Shield className="mr-4 text-yellow-400" size={48} />
            Platform Rules & Regulations
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Comprehensive guidelines to ensure a safe, transparent, and compliant investment experience.
          </p>
        </div>

    
    
   
        {/* Rules Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-blue rounded-xl p-6 border border-blue-700/30">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Star className="mr-3 text-yellow-400" />
              Navigation
            </h2>
            <div className="space-y-2">
              {rulesSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center ${
                    activeSection === section.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-blue-700/50 text-blue-200'
                  }`}
                >
                  <section.icon className="mr-3" size={20} />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2 bg-blue/10 rounded-xl p-8 backdrop-blur-lg border border-blue-700/30">
            {rulesSections.map((section) => {
              if (section.id !== activeSection) return null;
              
              return (
                <div key={section.id}>
                  <h2 className="text-3xl font-bold mb-6 flex items-center">
                    <section.icon className="mr-4 text-yellow-400" size={36} />
                    {section.title}
                  </h2>
                  <ul className="space-y-4">
                    {section.content.map((rule, index) => (
                      <li 
                        key={index} 
                        className="bg-blue-800/20 p-4 rounded-lg border border-blue-700/30 flex items-start"
                      >
                        <Info className="mr-4 mt-1 text-yellow-400 flex-shrink-0" size={24} />
                        <span className="text-blue-100">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-red-900/20 border border-red-700/30 rounded-xl p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
          <p className="text-red-200 max-w-3xl mx-auto">
            Disclaimer: Cryptocurrency investments are subject to market risks. 
            The value of investments can go up or down, and you may not get back 
            the amount you invested. Past performance is not a guarantee of future results.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default RulesSection;