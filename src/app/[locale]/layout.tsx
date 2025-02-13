import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/context/AuthContext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eurobank",
  description: "Cryptocurrency investment platform",
  icons:{
    icon:'/e.svg'
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout(props: RootLayoutProps) {

  const { locale } = await props.params;

  
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Provide the messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <AuthProvider>
      <body  className={`
        min-h-screen 
        overflow-x-hidden
        bg-background 
        font-sans 
        antialiased 
        ${geistSans.variable} 
        ${geistMono.variable}
        ${locale === 'ar' ? 'rtl' : 'ltr'}
      `}>
        <NextIntlClientProvider messages={messages}>
          {props.children}
        </NextIntlClientProvider>
      </body>
      </AuthProvider>
    </html>
  );
}