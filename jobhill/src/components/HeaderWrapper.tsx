// components/HeaderWrapper.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, ClipboardList, Menu, X, UserRound } from "lucide-react";
import { useAuthModal } from '@/contexts/AuthModalContext';
import { getAvatarUrl, getDisplayName } from '@/utils/profileUtils';
import { AntWaving } from '@/components/mascots';

const NAV_LINKS = [
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase, protected: false },
  { href: '/my-applications', label: 'My Applications', icon: ClipboardList, protected: true },
];

export default function HeaderWrapper() {
  const { openLoginModal, user, loading } = useAuthModal();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cierra el menú móvil al navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Sombra del header solo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del body con el menú abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const handleProtectedClick = (e: React.MouseEvent, isProtected: boolean) => {
    if (!user && isProtected) {
      e.preventDefault();
      setMobileOpen(false);
      openLoginModal();
    }
  };

  const avatarUrl = getAvatarUrl(user);
  const displayName = getDisplayName(user);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/85 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-white/70 ${
        scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tight text-brand-600 sm:text-[1.75rem]"
        >
          JOBHILL
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map(({ href, label, protected: isProtected }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleProtectedClick(e, isProtected)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="skeleton h-9 w-9 rounded-full" />
          ) : user ? (
            <Link
              href="/profile"
              aria-label="Profile"
              title={displayName}
              className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 transition ${
                isActive('/profile') ? 'ring-brand-500' : 'ring-slate-200 hover:ring-brand-300'
              }`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="flex h-full w-full items-end justify-center bg-brand-50">
                  <AntWaving animated={false} className="h-[115%] w-[115%] translate-y-0.5" />
                </span>
              )}
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary">Sign up</Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-slate-900/20 backdrop-blur-[2px] animate-fade-in md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="absolute inset-x-0 top-16 z-40 border-b border-slate-200 bg-white px-4 pb-5 pt-2 shadow-pop animate-slide-up md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon, protected: isProtected }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={(e) => handleProtectedClick(e, isProtected)}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors ${
                      isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    href="/profile"
                    aria-current={isActive('/profile') ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors ${
                      isActive('/profile') ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <UserRound className="h-5 w-5" />
                    Profile
                  </Link>
                </li>
              )}
            </ul>
            {!loading && !user && (
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <Link href="/login" className="btn-secondary">Log in</Link>
                <Link href="/register" className="btn-primary">Sign up</Link>
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
