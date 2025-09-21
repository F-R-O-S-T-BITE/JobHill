'use client'

import {  Settings, LogOut, Building2 } from 'lucide-react'

type ActiveSection = 'preferences' | 'apply-extension'

interface ProfileSidebarProps {
  user: any
  displayName: string
  avatarUrl: string | null
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  handleSignOut: () => void
}

export default function ProfileSidebar({
  user,
  displayName,
  avatarUrl,
  activeSection,
  setActiveSection,
  handleSignOut
}: ProfileSidebarProps) {
  return (
    <div className="w-1/6 bg-white shadow-lg flex flex-col h-full">
      {/* User Profile Section */}
      <div className=" p-4 sm:p-6 text-center">
        <div className="relative inline-block ">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-24 h-24 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full border-2 border-[#0353A4] shadow-md"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-2 border-[#0353A4] flex items-center justify-center">
             <img className='rounded-full w-full h-full object-cover' src="resources/ants/jobmigaShirt.png" alt="" />
            </div>
          )}
        </div>
        <h2 className="mt-2 text-sm sm:text-base font-bold text-gray-900 truncate px-2">{displayName}</h2>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2">
          <button
              onClick={() => setActiveSection('preferences')}
              className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-left rounded-lg transition-colors ${
                activeSection === 'preferences'
                  ? 'bg-[#0353A4] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
            <Settings className="w-4 h-4" />
            <span className="font-medium text-xs sm:text-sm">Preferences</span>
          </button>
        {/* Disabled Section 
        <button
          onClick={() => setActiveSection('apply-extension')}
          disabled={false}
          className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors text-gray-400 cursor-not-allowed opacity-50"
        >
          <Building2 className="w-4 h-4" />
          <span className="font-medium text-sm">Apply Extension</span>
        </button>
        */}
      </nav>

      <div className="flex justify-center p-2">
        <button
          onClick={handleSignOut}
          className="w-full sm:w-2/3 mb-4 sm:mb-20 p-2 flex items-center justify-center rounded-lg bg-[#C80404] hover:bg-red-700 transition-colors text-white"
        >
          <span className="font-medium text-xs sm:text-sm">Log Out</span>
        </button>
      </div>
    </div>
  )
}