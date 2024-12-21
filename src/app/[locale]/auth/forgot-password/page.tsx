'use client';

import { useState, FormEvent } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPasswordPage'); // Load translations from a namespace
  const [email, setEmail] = useState<string>('');
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('title')}</h1>
        {success ? (
          <p className="text-center text-sm text-green-500">{t('successMessage')}</p>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border text-black border-[hsl(var(--border))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">
                {t('error')} {error.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-yellow-500 transition duration-300 font-semibold"
              disabled={sending}
            >
              {sending ? t('loading') : t('resetButton')}
            </button>
          </form>
        )}
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-[hsl(var(--foreground))] hover:underline mr-4">
            {t('backToLogin')}
          </Link>
          <Link href="/auth/signup" className="text-[hsl(var(--foreground))] hover:underline">
            {t('signupLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
