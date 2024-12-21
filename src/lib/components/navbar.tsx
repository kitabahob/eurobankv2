'use client';

import React from 'react';
import { Home, Clock, MessagesSquare, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { icon: Home, label: 'Home' },
    { icon: Clock, label: 'History' },
    { icon: MessagesSquare, label: 'Support' },
    { icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary py-3 border-t border-border">
      <div className="grid grid-cols-4 text-center">
        {tabs.map(({ icon: Icon, label }, index) => (
          <button
            key={index}
            onClick={() => onTabChange(label.toLowerCase())}
            className={`flex flex-col items-center ${
              activeTab === label.toLowerCase() ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
