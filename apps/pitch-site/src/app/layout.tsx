import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Gentle Reminder — 23 Patented Innovations in Dementia Care',
  description:
    'A platform with 23 patentable innovations across cognitive assessment, digital biomarkers, AI, UX, and compliance. FDA SaMD pathway. Seeking seed investment, strategic partnerships, and research grants.',
  openGraph: {
    title: 'Gentle Reminder — Dementia Care Platform',
    description: '23 patentable innovations. $186B market. Seeking $5M seed.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
