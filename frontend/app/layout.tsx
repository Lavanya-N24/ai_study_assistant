import type { Metadata } from 'next';
import '../styles/globals.css';
import LayoutWrapper from '../components/LayoutWrapper';
import { ThemeProvider } from '../components/ThemeProvider';
import { UserProvider } from '../context/UserContext';
import { AuthProvider } from '../context/AuthContext';
import GoogleProvider from '../components/GoogleProvider';

export const metadata: Metadata = {
  title: 'AI Study Assistant',
  description: 'Your intelligent RAG-powered study companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={['light', 'dark', 'midnight', 'system']}
          disableTransitionOnChange
        >
          <GoogleProvider>
            <AuthProvider>
              <UserProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </UserProvider>
            </AuthProvider>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
