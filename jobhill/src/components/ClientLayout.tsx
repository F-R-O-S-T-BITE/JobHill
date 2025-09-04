'use client';

import { usePathname } from 'next/navigation';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import HeaderWrapper from '@/components/HeaderWrapper';
import LoginModal from '@/components/Modals/LoginModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Rutas donde no mostrar el header
  const authRoutes = ['/login', '/register','/forgot-password', '/auth/reset-password'];
  const shouldShowHeader = !authRoutes.some(route => pathname.startsWith(route));

  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-white">
        {shouldShowHeader && <HeaderWrapper />}
        <main >
          {children}
        </main>
        <LoginModal />
      </div>
    </AuthModalProvider>
  );
}