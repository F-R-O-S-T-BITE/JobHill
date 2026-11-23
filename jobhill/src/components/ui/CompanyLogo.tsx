// components/ui/CompanyLogo.tsx
'use client';

import { useState } from 'react';
import { logoImageClass } from '@/utils/logo';

interface CompanyLogoProps {
  src?: string | null;
  name: string;
  className?: string;
  rounded?: string;
}

/** Logo de empresa con fallback a la inicial si la imagen falla o no existe. */
export default function CompanyLogo({ src, name, className = 'h-12 w-12', rounded = 'rounded-xl' }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`${className} ${rounded} flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 font-display font-bold text-brand-700 ring-1 ring-brand-100`}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={`${className} ${rounded} flex shrink-0 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200`}>
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        className={logoImageClass(src)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
