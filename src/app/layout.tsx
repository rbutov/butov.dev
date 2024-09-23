import '../styles/globals.css';

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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`overflow-hidden font-sans ${inter.variable}`}>
        <main className="flex min-h-screen items-center justify-center bg-[#3c3c3c] font-mono text-[11px] sm:text-[13px]">
          <pre className="max-w-[90%] whitespace-pre-wrap rounded-lg bg-[#1e1f22] text-[#bcbec4] shadow-lg">
            <div className="relative w-full">
              <div className="flex h-8 items-center justify-between rounded-t-lg bg-[#2b2d30] px-2 text-[#bbbbbb]">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
                  <div className="ml-2 text-xs font-medium"></div>
                </div>
              </div>
            </div>
            <div className="p-6">{children}</div>
          </pre>
        </main>
      </body>
    </html>
  );
}
