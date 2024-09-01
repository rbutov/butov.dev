import '~/styles/globals.css';

import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Ruslan Butov',
  description: '',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans overflow-hidden ${inter.variable}`}>{children}</body>
    </html>
  );
}
