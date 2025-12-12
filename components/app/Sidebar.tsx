'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'

const navItems = [
  { href: '/app', label: 'Dashboard', icon: '🏠' },
  { href: '/app/streaks', label: 'Streaks', icon: '🔥', highlight: true },
  { href: '/app/planner', label: 'Daily Planner', icon: '📅' },
  { href: '/app/journal', label: 'Journal', icon: '📝' },
  { href: '/app/recommendations', label: 'Smart Picks', icon: '🎯', highlight: true },
  { href: '/app/review', label: 'Weekly Review', icon: '📋' },
  { href: '/app/quick-ritual', label: 'Quick Ritual', icon: '⚡' },
  { href: '/app/coach', label: 'AI Coach', icon: '🤖' },
  { href: '/app/rituals', label: 'Rituals', icon: '✨' },
  { href: '/app/loops', label: 'Loops', icon: '🔄' },
  { href: '/app/challenges', label: 'Challenges', icon: '🏆' },
  { href: '/app/marketplace', label: 'Marketplace', icon: '🏪' },
  { href: '/app/insights', label: 'Insights', icon: '📊' },
  { href: '/app/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/app">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
            RitualOS
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {(item as any).highlight && !isActive && (
                  <span className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-gray-500 text-sm truncate">{user?.email || ''}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm"
        >
          Logout
        </motion.button>
      </div>
    </aside>
  )
}

