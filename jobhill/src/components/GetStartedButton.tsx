'use client';

import Link from 'next/link';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function GetStartedButton() {
  const { user, loading } = useAuthModal();

  if (loading) {
    return (
      <div className="mt-4 bg-gray-300 text-gray-500 px-6 py-3 rounded font-semibold inline-block cursor-not-allowed">
        Loading...
      </div>
    );
  }

  const href = user ? '/opportunities' : '/register';
  const text = user ? 'View Opportunities' : 'Get Started';

  return (
    <Link 
      href={href} 
      className="mt-4 bg-[#0353A4] text-white px-6 py-3 rounded hover:bg-[#03459E] transition-colors font-semibold inline-block"
    >
      {text}
    </Link>
  );
}
