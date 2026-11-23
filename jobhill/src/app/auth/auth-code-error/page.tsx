'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Authentication Error
          </h1>
          <p className="mt-2 text-base text-slate-500">
            There was a problem with your authentication code. The code might be invalid or expired.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="btn-primary"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
