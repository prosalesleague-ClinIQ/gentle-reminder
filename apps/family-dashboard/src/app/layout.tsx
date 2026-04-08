import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'Gentle Reminder - Family Portal',
  description: 'Family member portal for the Gentle Reminder dementia care platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: '#FAF5FF',
          color: '#1F2937',
          minHeight: '100vh',
          fontSize: 16,
        }}
      >
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: 240,
              padding: '32px 40px',
              maxWidth: 1200,
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
