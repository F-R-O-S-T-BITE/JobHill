// components/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import HeaderWrapper from '@/components/HeaderWrapper';
import LoginModal from '@/components/Modals/LoginModal';
import OnboardingModal from '@/components/Onboarding/OnboardingModal';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { Toaster } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // En celular los avisos van arriba para no tapar botones ni modales
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsSmallScreen(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  
  // Rutas donde no mostrar el header o onboarding
  const authRoutes = ['/login', '/register','/forgot-password', '/auth/reset-password'];
  const shouldShowHeader = !authRoutes.some(route => pathname.startsWith(route));
  const shouldShowOnboarding = !authRoutes.some(route => pathname.startsWith(route));


  const { data: onboardingStatus, isLoading: isOnboardingLoading } = useOnboardingStatus();

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);

      if (isAuth && !isOnboardingLoading && onboardingStatus?.needsOnboarding) {
        setShowOnboarding(true);
      }
    };

    checkAuthAndOnboarding();

    // Auth listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
    });

    return () => subscription.unsubscribe();
  }, [onboardingStatus?.needsOnboarding, isOnboardingLoading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };


  return (
    <AuthModalProvider>
      <Toaster
        position={isSmallScreen ? 'top-center' : 'bottom-right'}
        reverseOrder={!isSmallScreen}
        containerClassName={isSmallScreen ? '!top-20' : '!bottom-6 !right-6'}
        toastOptions={{
          duration: 6500,
          className: '!rounded-xl !shadow-pop !text-sm !text-slate-900',
        }}
      />
      <div className="flex min-h-dvh flex-col bg-white">
        {shouldShowHeader && <HeaderWrapper />}
        <main className="flex-1">
          {children}
        </main>
        <LoginModal />
        {shouldShowOnboarding &&  <OnboardingModal 
          isVisible={showOnboarding}
          onComplete={handleOnboardingComplete}
        />}
       
      </div>
    </AuthModalProvider>
  );
}
