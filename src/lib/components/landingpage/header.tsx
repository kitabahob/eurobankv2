import React, { useState } from 'react';
import { LogIn, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  t: (key: string) => string; // Function to handle translations
  language: string; // Current language (e.g., "en" or "ar")
  setIsLanguageDropdownOpen: (open: boolean) => void; // Function to toggle the language dropdown state
  isLanguageDropdownOpen: boolean; // Current state of the language dropdown
  toggleLanguage: (lang: string) => void; // Function to switch languages
}

const Header: React.FC<HeaderProps> = ({
  t,
  language,
  setIsLanguageDropdownOpen,
  isLanguageDropdownOpen,
  toggleLanguage,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-secondary/30 backdrop-blur-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🏦</span>
          <h1 className="text-xl font-bold text-foreground">EuroBank</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 items-center">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#referral" className="text-foreground hover:text-primary transition-colors">
            {t('nav.referral')}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-md hover:bg-primary/90 transition-all group"
          >
            <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            {t('nav.signin')}
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-2 rounded-full hover:bg-secondary/80 transition-colors"
            >
              {language === 'en' ? '🇺🇸' : '🇸🇦'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {isLanguageDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`w-full text-left px-4 py-2 hover:bg-accent flex items-center ${
                    language === 'en' ? 'bg-accent/50' : ''
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => toggleLanguage('ar')}
                  className={`w-full text-left px-4 py-2 hover:bg-accent flex items-center ${
                    language === 'ar' ? 'bg-accent/50' : ''
                  }`}
                >
                  🇸🇦 العربية
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary/30 backdrop-blur-md p-4">
          <a href="#features" className="block text-foreground hover:text-primary transition-colors mb-2">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="block text-foreground hover:text-primary transition-colors mb-2">
            {t('nav.pricing')}
          </a>
          <a href="#referral" className="block text-foreground hover:text-primary transition-colors">
            {t('nav.referral')}
          </a>
          <div className="mt-4">
            <button
              className="w-full bg-primary text-primary-foreground py-2 rounded-full shadow-md hover:bg-primary/90 transition-all"
            >
              {t('nav.signin')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
