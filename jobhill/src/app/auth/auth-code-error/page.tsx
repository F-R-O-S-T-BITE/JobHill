'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h1>
          <p className="mt-2 text-base text-gray-500">
            There was a problem with your authentication code. The code might be invalid or expired.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0353A4] hover:bg-[#024080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0353A4]"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
