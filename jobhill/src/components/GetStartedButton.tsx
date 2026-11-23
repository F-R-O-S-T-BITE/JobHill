// components/GetStartedButton.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function GetStartedButton() {
  const { user, loading } = useAuthModal();

  if (loading) {
    return <div className="skeleton h-12 w-44 rounded-lg" aria-hidden="true" />;
  }

  const href = user ? '/opportunities' : '/register';
  const text = user ? 'View opportunities' : 'Get started';

  return (
    <Link href={href} className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/20">
      {text}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
