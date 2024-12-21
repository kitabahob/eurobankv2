'use client';
import React from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { Home, ArrowDownToLine, Headphones, User } from 'lucide-react';

interface BottomNavProps {}

const BottomNav: React.FC<BottomNavProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Define navigation tabs
  const tabs = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Deposit', icon: ArrowDownToLine, path: '/deposit' },
    { label: 'Support', icon: Headphones, path: '/support' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary flex justify-around items-center h-16 border-t border-muted-foreground/10 md:hidden">
      {tabs.map(({ label, icon: Icon, path }) => (
        <div
          key={label}
          onClick={() => router.push(path)}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            pathname === path ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomNav;
