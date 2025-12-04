'use client'

/**
 * App Layout
 * 
 * Protected layout for authenticated users with sidebar navigation
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Sidebar from '@/components/app/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}

