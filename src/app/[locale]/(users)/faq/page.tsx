'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  color: string;
  items: FAQItem[];
}

const FAQPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('faq'); // Hook for translations
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqSections: FAQSection[] = [
    {
      title: t('sections.accountManagement.title'),
      color: 'text-blue-400',
      items: [
        {
          question: t('sections.accountManagement.items.createAccount.question'),
          answer: t('sections.accountManagement.items.createAccount.answer'),
        },
        {
          question: t('sections.accountManagement.items.resetPassword.question'),
          answer: t('sections.accountManagement.items.resetPassword.answer'),
        },
      ],
    },
    {
      title: t('sections.investment.title'),
      color: 'text-green-400',
      items: [
        {
          question: t('sections.investment.items.investmentPlans.question'),
          answer: t('sections.investment.items.investmentPlans.answer'),
        },
      ],
    },
    {
      title: t('sections.security.title'),
      color: 'text-red-400',
      items: [
        {
          question: t('sections.security.items.accountSecurity.question'),
          answer: t('sections.security.items.accountSecurity.answer'),
        },
      ],
    },
  ];

  const filteredFAQs = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <button onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl text-primary font-bold">{t('title')}</h1>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-background/30 border border-blue-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        {filteredFAQs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div
              className={`${section.color} flex items-center justify-between bg-accent-800/50 backdrop-blur-md p-4 rounded-t-2xl cursor-pointer`}
              onClick={() => setActiveSection(activeSection === sectionIndex ? null : sectionIndex)}
            >
              <h3 className="text-xl font-semibold">{section.title}</h3>
              {activeSection === sectionIndex ? <ChevronUp /> : <ChevronDown />}
            </div>
            {activeSection === sectionIndex && (
              <div className="bg-background/30 border border-blue-700/50 rounded-b-2xl">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 border-b border-blue-700/20 last:border-b-0">
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ height: '100px' }}></div>

    </div>
  );
};

export default FAQPage;
