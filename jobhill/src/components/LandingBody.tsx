// components/LandingBody.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import styles from './slider.module.css';
import { useLandingData } from '@/hooks/useLandingData';
import { AntMarching, AntTracker } from '@/components/mascots';
import { logoImageClass } from '@/utils/logo';

const FALLBACK_LOGOS = Array.from({ length: 6 }, (_, i) => ({
  id: `marchingant${i + 1}`,
  name: 'MarchingAnt',
  logo_url: '',
}));

const FALLBACK_STATS = {
  newInternRoles: 1230,
  newDataMLPositions: 463,
  newSWEPositions: 828,
  totalOpportunities: 13000,
};

function AnimatedCounter({ target, duration = 2000, isVisible }: { target: number; duration?: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    // Respeta "reducir movimiento"
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    let startTime: number | undefined;
    let frame: number;
    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(progress < 1 ? Math.floor(eased * target) : target);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, target, duration]);

  return <>{count.toLocaleString()}</>;
}

/** Logo del carrusel con fallback seguro (antes usaba innerHTML con el nombre de la empresa) */
function LogoSlide({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [failed, setFailed] = useState(false);
  // Placeholder mientras carga (o si no hay logo): una hormiga marchando
  const isPlaceholder = !logoUrl;

  return (
    <div className={styles.slide}>
      {isPlaceholder ? (
        <AntMarching className="h-14 w-auto" />
      ) : failed ? (
        <div className="flex flex-col items-center justify-center text-center">
          <AntMarching className="mb-1 h-10 w-auto" />
          <span className="max-w-[120px] truncate text-xs font-medium text-slate-500">{name}</span>
        </div>
      ) : (
        <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition-transform hover:scale-105">
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className={logoImageClass(logoUrl)}
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}

const STATS = [
  { key: 'newInternRoles', label: 'New intern roles', icon: '/resources/home/New_Home.png', duration: 2000 },
  { key: 'newDataMLPositions', label: 'New AI & ML positions', icon: '/resources/home/MLPositions_Home.png', duration: 2200 },
  { key: 'newSWEPositions', label: 'New SWE positions', icon: '/resources/home/RolesOpen_home.png', duration: 1800 },
  { key: 'totalOpportunities', label: 'Open opportunities', icon: '/resources/home/TotalOpportunities_home.png', duration: 2500 },
] as const;

const FEATURES = [
  {
    title: 'Daily internship opportunities',
    description: 'New postings every day, with filters for role, location, modality and work authorization.',
    icon: '/resources/home/suitcase_home.png',
  },
  {
    title: 'Track your applications',
    description: 'Keep all your applications in one table and update their status as you hear back.',
    icon: '/resources/home/checklist_home.png',
  },
  {
    title: 'Autofill (coming soon)',
    description: 'We\'re building a browser extension that fills in applications for you, so you only review and submit.',
    icon: '/resources/home/autocomplete_home.png',
  },
];

function LandingBody() {
  const { companyLogos, jobStats, isLoading } = useLandingData();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsVisible(true),
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const logos = isLoading ? FALLBACK_LOGOS : companyLogos;
  const stats = isLoading ? FALLBACK_STATS : jobStats;

  return (
    <>
      {/* Logos */}
      <section className="border-y border-slate-100 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Recent internship opportunities from
          </p>
        </div>
        <div className={styles.slider}>
          <div className={styles.slideTrack}>
            {[...logos, ...logos].map((company, index) => (
              <LogoSlide key={`${company.id}-${index}`} name={company.name} logoUrl={company.logo_url} />
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={statsRef}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Thousands of internships,{' '}
              <span className="text-brand-600">all in one place</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              New roles are added every day.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STATS.map(({ key, label, icon, duration }) => (
              <div key={key} className="card flex items-center gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <Image src={icon} alt="" width={32} height={32} />
                </div>
                <div className="min-w-0">
                  <dd className="font-display text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                    <AnimatedCounter target={stats[key]} isVisible={statsVisible && !isLoading} duration={duration} />
                  </dd>
                  <dt className="text-sm text-slate-500">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Características */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">What you get</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From finding a role to tracking your application
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card group p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 transition-colors group-hover:bg-brand-100">
                  <Image src={f.icon} alt="" width={32} height={32} />
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracker */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Organize your job search with an application tracker
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See every application you've sent and where each one stands.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Status, referral and dates for every application',
                'Filter by company, status or referral',
                'Edit several at once or export them to Excel',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/my-applications" className="btn-primary mt-8 px-5 py-3">
              Open my tracker
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-center">
            <AntTracker
              title="A Jobhill ant checking off applications in its tracker"
              className="h-auto w-full max-w-sm md:max-w-md"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingBody;
