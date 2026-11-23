// components/Modals/LoginModal.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, X } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function LoginModal() {
  const { showLoginModal, closeLoginModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (!showLoginModal) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeLoginModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLoginModal, closeLoginModal]);

  if (!showLoginModal) return null;

  const go = (path: string) => {
    router.push(path);
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={closeLoginModal}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-pop animate-slide-up sm:rounded-2xl sm:p-8"
      >
        <button
          aria-label="Close"
          onClick={closeLoginModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h2 id="login-modal-title" className="font-display text-2xl font-bold text-slate-900">
          Sign in to continue
        </h2>
        <p className="mt-2 text-slate-600">
          You need an account to use this feature.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => go('/register')} className="btn-secondary py-3 sm:order-1">
            Create account
          </button>
          <button onClick={() => go('/login')} className="btn-primary py-3 sm:order-2">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
