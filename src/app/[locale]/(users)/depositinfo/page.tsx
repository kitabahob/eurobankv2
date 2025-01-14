'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'; 
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Copy 
} from 'lucide-react';
import Image from 'next/image';

export default function DepositInfo() {
  const t = useTranslations('DepositInfo'); // Accessing translations
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const depositAddress = 'TMaLDP1gPgiPVr8aoKm1YFLA56b8Dihgpj'; // Example USDT TRC20 address

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(t('copySuccess'));
    });
  };

  const navigateToDepositStatus =()=>{
    router.push('/depositStatus')
  }
  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          router.push('/deposit'); // Redirect when time expires
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Format time remaining
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <h1 className="text-2xl text-primary font-bold">{t('depositInfo')}</h1>
          </div>
        </div>

        {/* Deposit Success */}
        <div className="bg-blue-900/50 backdrop-blur-md p-6 mb-8 rounded-2xl border border-blue-700/50 flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold text-center text-primary mb-2">{t('depositSuccess')}</h2>
          <p className="text-muted-foreground text-center">{t('depositProcessing')}</p>
        </div>

        {/* Time Remaining */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-yellow-400 p-2 rounded-full bg-secondary">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-primary">{t('timeRemaining')}</h3>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">{formatTime(timeRemaining)}</p>
            <p className="text-muted-foreground">{t('timeLimitNotice')}</p>
          </div>
        </div>

        {/* Deposit Address */}
        <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-700/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-blue-400 p-2 rounded-full bg-secondary">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-primary">{t('depositAddress')}</h3>
          </div>
          <div className="bg-background/30 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('usdtTrc20Address')}</p>
              <p className="font-medium text-primary break-all">{depositAddress}</p>
            </div>
            <Copy 
              className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary"
              onClick={() => copyToClipboard(depositAddress)}
            />
          </div>
          <Image src='/qr.jpeg' height={100} width={100} alt='QR Code'
          className='mx-auto'/>
          <p className="text-sm text-muted-foreground text-center mt-4">
            {t('onlySendUsdt')}
          </p>


           {/* verify Deposit  */}
           <button

              onClick={navigateToDepositStatus}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl mt-6 flex items-center justify-center space-x-3 transition-all"
            >
              <span>{t('verifyDeposit')}</span>
            </button>
         
       
        </div>

        {/* Warning */}
        <div className="bg-red-800/50 backdrop-blur-md rounded-2xl p-6 border border-red-700/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-red-400 p-2 rounded-full bg-secondary">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-red-400">{t('importantNotice')}</h3>
          </div>
          <p className="text-muted-foreground">
            {t('importantDetails')}
          </p>
        </div>
      </div>
    </div>
  );
}
