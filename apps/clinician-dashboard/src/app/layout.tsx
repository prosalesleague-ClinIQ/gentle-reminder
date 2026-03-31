import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'Gentle Reminder - Clinical Portal',
  description: 'Clinical reporting dashboard for the Gentle Reminder dementia care platform',
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
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: '#F1F5F9',
          color: '#0F172A',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: 240,
            minHeight: '100vh',
            padding: '32px 40px',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
