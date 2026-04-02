import React from 'react';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Gentle Reminder - Admin Portal',
  description: 'Administrative dashboard for the Gentle Reminder dementia care platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: '#010409',
          color: '#C9D1D9',
          minHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: 260,
              minHeight: '100vh',
              padding: '32px 40px',
              backgroundColor: '#010409',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
