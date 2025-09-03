'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 6 * 60 * 60 * 1000, // 6 hours
            gcTime: 10 * 60 * 60 * 1000, // 10 hours (garbage collection)
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              return failureCount < 3
            },
            refetchOnWindowFocus: false, 
            refetchOnReconnect: 'always', 
          },
          mutations: {
            retry: 1, 
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}