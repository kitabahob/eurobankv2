/* src/app/layout.tsx */
import './globals.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Value Stocke',
  description: 'موقع التجربة — إشارات الأسهم واستكشاف الفرص بسهولة'
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
