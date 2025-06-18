'use client';

import { usePathname } from 'next/navigation';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import HeaderWrapper from '@/components/HeaderWrapper';
import LoginModal from '@/components/LoginModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Rutas donde NO queremos mostrar el header
  const authRoutes = ['/login', '/register'];
  const shouldShowHeader = !authRoutes.some(route => pathname.startsWith(route));

  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-gray-50">
        {shouldShowHeader && <HeaderWrapper />}
        <main className={shouldShowHeader ? 'pt-4' : ''}>
          {children}
        </main>
        <LoginModal />
      </div>
    </AuthModalProvider>
  );
}