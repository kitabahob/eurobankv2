'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { supabase } from '@/lib/db';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { v4 as uuidv4 } from 'uuid';

export default function SignupPage() {
  const t = useTranslations('SignupPage'); // Load translations from a namespace
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [referralId, setReferralId] = useState<string>('');
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    console.log('Signup process started.');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Referral ID:', referralId);

    try {
      // Step 1: Create user in Firebase
      console.log('Creating user in Firebase...');
      const firebaseUser = await createUserWithEmailAndPassword(email, password);

      if (!firebaseUser?.user) {
        console.error('Firebase user creation failed.');
        throw new Error('Failed to create user in Firebase.');
      }

      console.log('Firebase user created successfully:', firebaseUser.user);
      const firebaseUid = firebaseUser.user.uid;

      // Step 2: Generate unique referral ID for the new user
      console.log('Generating unique referral ID...');
      const uniqueReferralID = uuidv4().slice(0, 8).toUpperCase();
      console.log('Generated referral ID:', uniqueReferralID);

      // Step 3: Insert user into Supabase database
      console.log('Inserting user into Supabase...');
      const { error: supabaseError } = await supabase.from('users').insert({
        firebase_uid: firebaseUid, // Store Firebase UID
        email,
        referral_id: uniqueReferralID, // Unique referral ID generated for the user
        referred_by: referralId || null, // Referral ID provided by the user (nullable)
      });

      if (supabaseError) {
        console.error('Error inserting user into Supabase:', supabaseError);
        console.error('Supabase error details:');
        console.error('Message:', supabaseError.message);
        console.error('Code:', supabaseError.code);
        console.error('Hint:', supabaseError.hint || 'No hint provided.');
        console.error('Details:', supabaseError.details || 'No additional details available.');
        throw new Error('Failed to store user data in database.');
      }

      // Step 4: Redirect to login page
      console.log('Redirecting to login page...');
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      setReferralId('');
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Signup error:', err.message);
      console.error('Error stack:', err.stack);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('title')}</h1>
        <form onSubmit={handleSignup} className="space-y-4">
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border text-black border-[hsl(var(--border))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="referralId" className="block text-sm font-medium mb-2">
              {t('referralIdLabel')}
            </label>
            <input
              id="referralId"
              type="text"
              placeholder={t('referralIdPlaceholder')}
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              className="w-full px-3 py-2 text-black border border-[hsl(var(--border))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
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
            disabled={loading}
          >
            {loading ? t('loading') : t('signupButton')}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-[hsl(var(--foreground))] hover:underline mr-4">
            {t('alreadyHaveAccount')}
          </Link>
          <Link href="/auth/forgot-password" className="text-[hsl(var(--foreground))] hover:underline">
            {t('forgotPassword')}
          </Link>
        </div>
      </div>
    </div>
  );
}
