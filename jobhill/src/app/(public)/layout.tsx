'use client';

import { useState } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import LoginModal from '@/components/LoginModal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <HeaderWrapper onLoginClick={() => setShowLoginModal(true)} />
      <main>{children}</main>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}