import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoneyMind — AI Financial Intelligence',
  description: 'AI-powered expense tracking, budgeting, and financial insights. Track spending, set goals, and get personalized AI coaching for smarter money decisions.',
  keywords: ['finance', 'expense tracker', 'budgeting', 'AI', 'money management'],
  authors: [{ name: 'MoneyMind' }],
  openGraph: {
    title: 'MoneyMind — AI Financial Intelligence',
    description: 'Your AI-powered financial companion. Smart budgets, real-time insights, bank-grade security.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0B1120] text-[#F5F3EE] antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
