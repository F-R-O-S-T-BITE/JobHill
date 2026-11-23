// components/Profile/ProfileSidebar.tsx
'use client'

import { LogOut, Settings } from 'lucide-react'
import { AntWaving } from '@/components/mascots'

type ActiveSection = 'preferences' | 'apply-extension'

interface ProfileSidebarProps {
  user: any
  displayName: string
  avatarUrl: string | null
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  handleSignOut: () => void
}

const SECTIONS: { id: ActiveSection; label: string; icon: typeof Settings }[] = [
  { id: 'preferences', label: 'Preferences', icon: Settings },
]

export default function ProfileSidebar({
  user,
  displayName,
  avatarUrl,
  activeSection,
  setActiveSection,
  handleSignOut,
}: ProfileSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="card overflow-hidden">
        {/* Perfil: horizontal en móvil, vertical en desktop */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-brand-500 to-brand-700 lg:h-20" />
          <div className="relative flex items-center gap-4 px-4 pb-4 pt-6 lg:flex-col lg:px-6 lg:pt-8 lg:text-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-brand-50 ring-4 ring-white shadow-md lg:h-28 lg:w-28">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <AntWaving title="Jobmiga waving" className="mt-2 h-full w-full scale-110" />
              )}
            </div>
            <div className="min-w-0 pt-6 lg:pt-0">
              <h2 className="truncate font-display text-base font-bold text-slate-900 lg:text-lg">{displayName}</h2>
              <p className="truncate text-sm text-slate-500">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex gap-2 border-t border-slate-100 p-3 lg:flex-col" aria-label="Profile sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              aria-current={activeSection === id ? 'page' : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors lg:justify-start ${
                activeSection === id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 lg:justify-start"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </div>
    </aside>
  )
}
