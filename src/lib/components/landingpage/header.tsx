import { useState } from 'react';
import { LogIn, Menu } from 'lucide-react'; 
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import './Navbar.css';

export default function Navbar() {
  const t = useTranslations('landingPage');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          {/* Logo for mobile */}
          <div className="logo-mobile">
            <Image 
              src="/e.svg" 
              alt="Logo" 
              height={40} 
              width={40}
              className="logo-image"
              priority 
            />
          </div>

          {/* Logo for desktop */}
          <div className="logo-desktop">
            <Image 
              src="/e.svg" 
              alt="Logo" 
              height={40} 
              width={40} 
              priority 
            />
          </div>

          <h1 className="brand-title">EuroBank</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav">
          <a href="#features" className="nav-link">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="nav-link">
            {t('nav.pricing')}
          </a>
          <a href="#apps" className="nav-link">
            {t('nav.apps')}
          </a>
          <a href="#faqs" className="nav-link">
            {t('nav.faqs')}
          </a>
        </div>

        {/* Desktop Signin Button and Language Switcher */}
        <div className="desktop-actions">
          <button
            className="signin-button"
            onClick={navigateToLogin}
          >
            <LogIn className="signin-icon" />
            {t('nav.signin')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={navigateToLogin}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <a href="#features" className="nav-link">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="nav-link">
            {t('nav.pricing')}
          </a>
          <a href="#apps" className="nav-link">
            {t('nav.apps')}
          </a>
          <a href="#faqs" className="nav-link">
            {t('nav.faqs')}
          </a>

          <div className="mobile-actions">
            <button
              type="button"
              className="signin-button"
              onClick={navigateToLogin}
            >
              <LogIn className="signin-icon" />
              {t('nav.signin')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}