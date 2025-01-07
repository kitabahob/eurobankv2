'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { supabase } from '@/lib/db'; 
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      // Step 1: Firebase Sign In
      const firebaseUser = await signInWithEmailAndPassword(email, password);

      if (!firebaseUser?.user) {
        throw new Error('Firebase authentication failed.');
      }

      const firebaseUid = firebaseUser.user.uid;

      // Step 2: Query Supabase for matching user
      const { data: userRecord, error: supabaseError } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (supabaseError) {
        console.error('Error querying Supabase:', supabaseError);
        throw new Error('Failed to fetch user information from database.');
      }

      if (!userRecord) {
        throw new Error('User record not found in database.');
      }

      const supabaseId = userRecord.id;

      // Step 3: Store Firebase UID and Supabase ID
      sessionStorage.setItem('firebase_uid', firebaseUid);
      sessionStorage.setItem('supabase_id', supabaseId);

      setEmail('');
      setPassword('');

      // Step 4: Redirect to Dashboard
      router.push('/admin/home');
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('loginTitle')}</h1>
        <form onSubmit={handleSignIn} className="space-y-4 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[hsl(var(--border))] text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[hsl(var(--border))] text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">
              {t('error')} {error.message}
            </p>
          )}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-yellow-500 transition duration-300 font-semibold"
              disabled={loading}
            >
              {loading ? t('loading') : t('loginButton')}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/admin/signup" className="text-[hsl(var(--foreground))] hover:underline mr-4">
            {t('signupLink')}
          </Link>
          <Link href="/auth/forgot-password" className="text-[hsl(var(--foreground))] hover:underline">
            {t('forgotPasswordLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
