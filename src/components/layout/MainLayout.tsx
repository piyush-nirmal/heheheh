import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';
import { KisanAI } from '@/components/chat/KisanAI';
import { useApp } from '@/contexts/AppContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Offline banner */}
      {!state.isOnline && (
        <div className="bg-red-500 text-white text-center text-sm py-1 font-medium z-50">
          You're offline. Data will sync when connected.
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer - Only visible on desktop/tablet usually, but good for all in responsive web */}
      <Footer />

      {/* Bottom navigation - Mobile only */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>

      {/* Global AI Chatbot */}
      <KisanAI />
    </div>
  );
};
