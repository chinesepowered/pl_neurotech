import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';

export const metadata: Metadata = {
  title: 'NeuroVault — Neural Data Wallet & Agent Marketplace',
  description: 'Own your neural data. Set consent terms. Let AI agents discover and purchase datasets on Filecoin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary antialiased">
        <Navbar />
        <main className="pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
