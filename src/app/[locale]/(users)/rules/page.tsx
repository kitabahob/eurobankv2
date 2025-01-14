'use client';
import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Lock, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  Star,
  ArrowLeft,
  LucideIcon
} from 'lucide-react';
import BottomNav from '@/lib/components/BottomNav';

interface RuleSection {
  id: string;
  icon: LucideIcon;
}

const RulesSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const router = useRouter();
  const t = useTranslations('rules');

  const rulesSections: RuleSection[] = [
    { id: 'overview', icon: BookOpen },
    { id: 'investmentLimits', icon: Shield },
    { id: 'riskManagement', icon: AlertTriangle },
    { id: 'securityProtocols', icon: Lock },
    { id: 'withdrawalRules', icon: TrendingUp },
    { id: 'compliance', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-muted-foreground hover:text-primary"
              aria-label={t('backToDashboard')}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl text-primary font-bold">{t('pageTitle')}</h1>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-blue-900/50 backdrop-blur-md p-6 mb-8 rounded-2xl border border-blue-700/50 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{t('header.title')}</h2>
          <p className="text-muted-foreground text-center">{t('header.subtitle')}</p>
        </div>

        {/* Rules Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 border border-blue-700/50">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-primary">
              <Star className="mr-3 text-yellow-400" />
              {t('navigation')}
            </h2>
            <div className="space-y-2">
              {rulesSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center ${
                    activeSection === section.id 
                      ? 'bg-blue-700/50 text-primary' 
                      : 'hover:bg-blue-700/30 text-muted-foreground'
                  }`}
                >
                  <section.icon className="mr-3" size={20} />
                  {t(`sections.${section.id}.title`)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2 bg-accent-800/50 backdrop-blur-md rounded-2xl p-6 border border-blue-700/50">
            {rulesSections.map((section) => {
              if (section.id !== activeSection) return null;
              
              const content = t.raw(`sections.${section.id}.content`) as string[];
              
              return (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-primary">
                    <section.icon className="mr-4 text-yellow-400" size={36} />
                    {t(`sections.${section.id}.title`)}
                  </h2>
                  <ul className="space-y-4">
                    {content.map((rule, index) => (
                      <li 
                        key={index} 
                        className="bg-blue-800/20 p-4 rounded-lg border border-blue-700/30 flex items-start"
                      >
                        <Info className="mr-4 mt-1 text-yellow-400 flex-shrink-0" size={24} />
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-red-900/20 border border-red-700/30 rounded-2xl p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
          <p className="text-red-200 max-w-3xl mx-auto">
            {t('disclaimer.content')}
          </p>
        </div>
        <div style={{ height: '100px' }}></div>

      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default RulesSection;