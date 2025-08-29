'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function HeaderWrapper() {
  const { openLoginModal } = useAuthModal();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Check initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user && (path === '/my-applications' || path === '/profile')) {
      e.preventDefault();
      openLoginModal();
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-[#0353A4] text-4xl font-black font-inter tracking-tight">
            JOBHILL
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/opportunities"
            className={`font-medium text-[#0353A4] border-b-2 pb-1 transition-all duration-300 ${
              isActive('/opportunities') ? 'border-[#0353A4]' : 'border-transparent hover:border-[#0353A4]/50'
            }`}
          >
            Opportunities
          </Link>
          
          <Link 
            href="/my-applications"
            onClick={(e) => handleProtectedClick(e, '/my-applications')}
            className={`font-medium text-[#0353A4] border-b-2 pb-1 transition-all duration-300 cursor-pointer ${
              isActive('/my-applications') ? 'border-[#0353A4]' : 'border-transparent hover:border-[#0353A4]/50'
            }`}
          >
            My Applications
          </Link>
        </nav>
        
        <div>
          {loading ? (
            <div className="w-6 h-6 animate-pulse bg-gray-300 rounded-full" />
          ) : user ? (
            <Link 
              href="/profile" 
              className="text-[#0353A4] hover:text-[#03459E] transition-colors"
            >
              <FaUser size={24} />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#0353A4] text-white px-4 py-2 rounded hover:bg-[#03459E] transition-colors font-semibold"
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}