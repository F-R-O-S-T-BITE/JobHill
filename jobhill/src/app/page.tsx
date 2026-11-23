// app/page.tsx
import Image from "next/image"
import Link from "next/link";
import { Sparkles } from "lucide-react";
import LandingBody from "@/components/LandingBody";
import GetStartedButton from "@/components/GetStartedButton";
import { AntWorking } from "@/components/mascots";

export const revalidate = 14400;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8 lg:py-24">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              New internships added every day
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Looking for an <span className="text-brand-600">internship?</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 md:mx-0 sm:text-xl">
              <span className="font-semibold text-brand-600">Jobhill</span> is your go-to platform for finding
              internships. Discover opportunities, manage your applications and start your journey today.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <GetStartedButton />
              <Link href="/opportunities" className="btn-ghost px-5 py-3 text-base">
                Browse opportunities
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <AntWorking
              title="A Jobhill ant working on its laptop"
              className="h-auto w-4/5 max-w-xs sm:max-w-sm md:w-full md:max-w-md"
            />
          </div>
        </div>
      </section>

      <LandingBody />

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">JOBHILL</span>
            <p className="text-sm text-brand-200">Helping you find your next opportunity.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <Image
                src="/resources/FROSTBITE_Logo_Footer.png"
                alt="F.R.O.S.T. BITE logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-sm">Built by F.R.O.S.T. BITE</span>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-brand-200 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} F.R.O.S.T. BITE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
