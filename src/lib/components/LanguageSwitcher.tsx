'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    // Replace the locale in the current pathname
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    
    // Navigate to the new path with the updated locale
    router.push(newPathname);
    router.refresh();
    setIsLanguageDropdownOpen(false);
  };

  const languageFlags = {
    en: '🇺🇸',
    ar: '🇸🇦'
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        className="
          flex items-center 
          bg-secondary 
          text-secondary-foreground 
          px-3 py-2 
          rounded-full 
          hover:bg-secondary/80 
          transition-colors
        "
      >
        {languageFlags[locale as keyof typeof languageFlags]}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isLanguageDropdownOpen && (
        <div className="
          absolute 
          right-0 
          mt-2 
          w-36 
          bg-popover 
          text-popover-foreground 
          rounded-lg 
          shadow-lg 
          border 
          border-border 
          overflow-hidden
        ">
          {Object.entries(languageFlags).map(([lang, flag]) => (
            <button 
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`
                w-full 
                text-left 
                px-4 py-2 
                hover:bg-accent 
                flex items-center 
                ${locale === lang ? 'bg-accent/50' : ''}
              `}
            >
              {flag} {lang === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}