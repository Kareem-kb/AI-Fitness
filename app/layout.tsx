import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Fitness Advisor',
  description:
    'exercise and health generator by Openai API makde by kareem-kb.tech',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="fixed top-0 flex justify-start bg-white pl-20">
          <h1 className="text-2xl font-bold">AI Fitness Advisor</h1>{' '}
        </nav>
        {children}
      </body>
    </html>
  );
}
