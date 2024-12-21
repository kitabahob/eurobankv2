'use client';
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqSections: FAQSection[] = [
    {
      title: 'Account Management',
      color: 'text-blue-400',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on "Sign Up"...',
        },
        {
          question: 'How can I reset my password?',
          answer: 'Go to the login page and click on "Forgot Password"...',
        },
      ],
    },
    {
      title: 'Investment',
      color: 'text-green-400',
      items: [
        {
          question: 'What investment plans are available?',
          answer: 'We offer a wide range of investment plans with different levels to choose from browse our levels in the home page to understand better',
        },
      ],
    },
    {
      title: 'Security',
      color: 'text-red-400',
      items: [
        {
          question: 'How secure is my account?',
          answer: 'We use a robust  authentication system to validate and verify our users identity and ensure a secure application.',
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
          <h1 className="text-2xl text-primary font-bold">FAQ</h1>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search FAQs..."
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
    </div>
  );
};

export default FAQPage;
