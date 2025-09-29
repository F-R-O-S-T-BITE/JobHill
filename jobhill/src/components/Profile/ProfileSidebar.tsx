'use client'

import {  Settings } from 'lucide-react'

type ActiveSection = 'preferences' | 'apply-extension'

interface ProfileSidebarProps {
  user: any
  displayName: string
  avatarUrl: string | null
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  handleSignOut: () => void
  isSidebarOpen: boolean
}

export default function ProfileSidebar({
  user,
  displayName,
  avatarUrl,
  activeSection,
  setActiveSection,
  handleSignOut,
  isSidebarOpen
}: ProfileSidebarProps) {
  return (
    <div className={`fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-30 w-64 md:w-1/4 lg:w-1/5 bg-white shadow-lg flex flex-col h-full mt-16 md:mt-0`}>
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
        <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2">
          <button
              onClick={() => setActiveSection('preferences')}
              className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-center rounded-lg transition-colors ${
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
        <div className="flex justify-center ">
        <button
          onClick={handleSignOut}
          className={`w-full  p-2 flex items-center justify-center rounded-lg bg-[#C80404] hover:bg-red-700 transition-colors text-white`}
        >
          <span className="font-medium text-xs sm:text-sm">Log Out</span>
        </button>
      </div>
      </nav>

    
    </div>
  )
}