import { useState } from 'react';
import { LogIn, Menu } from 'lucide-react'; 
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {useRouter} from '@/i18n/routing'

export default function Navbar() {
  const t = useTranslations('landingPage');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router=useRouter()

  const navigateToLogin = () => {
    router.push('/auth/login')
  };

  return (
    
    <nav className="fixed top-0 left-0 right-0 bg-secondary/30 backdrop-blur-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          {/* Logo for mobile (small screens) */}
          <div className="md:hidden">
            <Image src="/e.svg" alt="Logo" height={40} width={60} priority />
          </div>

          {/* Logo for desktop (large screens) */}
          <div className="hidden md:block">
            <Image src="/e.svg" alt="Logo" height={40} width={100} priority />
          </div>

          <h1 className="text-xl font-bold text-foreground">EuroBank</h1>
        </div>
    {/* Desktop Navigation Links */}
    <div className="hidden md:flex space-x-4 items-center">
          <a href="#features" className="text-white hover:text-primary  transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-white hover:text-primary transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#apps" className="text-white hover:text-primary transition-colors">
            {t('nav.apps')}
          </a>
          <a href="#faqs" className="text-white hover:text-primary transition-colors">
            {t('nav.faqs')}
          </a>
        </div>

        {/* Desktop Signin Button and Language Switcher */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all group"
            onClick={navigateToLogin}
          >
            <LogIn className="w-4  h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            {t('nav.signin')}
          </button>
          <LanguageSwitcher />
        </div>


        

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex flex-col justify-center items-center w-8 h-8 text-muted-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-secondary/90 backdrop-blur-md`}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          <a href="#features" className="text-white hover:text-primary transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#apps" className="text-foreground hover:text-primary transition-colors">
            {t('nav.apps')}
          </a>
          <a href="#faqs" className="text-foreground hover:text-primary transition-colors">
            {t('nav.faqs')}
          </a>

          <div className="mt-4 flex flex-col items-center space-y-4">
            <button
              type="button"
              className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all group"
              onClick={navigateToLogin}
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              {t('nav.signin')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}