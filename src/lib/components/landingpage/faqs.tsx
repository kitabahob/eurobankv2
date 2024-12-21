import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
  const { t } = useTranslation('common');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { question: t('faqs.question1'), answer: t('faqs.answer1') },
    { question: t('faqs.question2'), answer: t('faqs.answer2') },
    { question: t('faqs.question3'), answer: t('faqs.answer3') },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="container mx-auto py-16 px-4">
      <h3 className="text-3xl font-bold text-center mb-12">{t('faqs.title')}</h3>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className=" bg-secondary text-card-foreground p-6 rounded-lg shadow-md"
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center bg-secondary cursor-pointer"
            >
              <h4 className="text-xl font-semibold flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                {faq.question}
              </h4>
              {activeIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </div>
            {activeIndex === index && (
              <p className="mt-4 text-muted-foreground">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
