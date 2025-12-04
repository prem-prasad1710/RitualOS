'use client'

/**
 * Main Dashboard Page
 * 
 * Shows greeting, streak, upcoming rituals, and quick actions
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import { getGreeting, calculateStreak } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [sessions, setSessions] = useState<any[]>([])
  const [loops, setLoops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAIModal, setShowAIModal] = useState(false)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const [sessionsRes, loopsRes] = await Promise.all([
        fetch('/api/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/loops', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const sessionsData = await sessionsRes.json()
      const loopsData = await loopsRes.json()

      setSessions(sessionsData.sessions || [])
      setLoops(loopsData.loops || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const streak = calculateStreak(sessions)
  const completedToday = sessions.filter(s => {
    if (!s.completedAt) return false
    const today = new Date()
    const sessionDate = new Date(s.completedAt)
    return sessionDate.toDateString() === today.toDateString()
  }).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400 text-xl">Loading your rituals...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-gray-400">
          {user?.focusGoal ? `Focused on ${user.focusGoal}` : 'Ready to create your first ritual?'}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Ritual Streak</p>
              <p className="text-4xl font-bold text-white">{streak}</p>
              <p className="text-purple-200 text-sm mt-1">days</p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm mb-1">Today's Rituals</p>
              <p className="text-4xl font-bold text-white">{completedToday}</p>
              <p className="text-cyan-200 text-sm mt-1">completed</p>
            </div>
            <div className="text-5xl">✨</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm mb-1">Total Loops</p>
              <p className="text-4xl font-bold text-white">{loops.length}</p>
              <p className="text-green-200 text-sm mt-1">created</p>
            </div>
            <div className="text-5xl">🔄</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/app/quick-ritual">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg text-center relative overflow-hidden"
            >
              <span className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs font-bold">SOS</span>
              <span className="text-4xl">⚡</span>
              <div>
                <p className="text-white font-semibold">Quick Ritual</p>
                <p className="text-white/80 text-xs">Emergency relief</p>
              </div>
            </motion.button>
          </Link>

          <Link href="/app/coach">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-center"
            >
              <span className="text-4xl">🤖</span>
              <div>
                <p className="text-white font-semibold">AI Coach</p>
                <p className="text-white/80 text-xs">Get personalized help</p>
              </div>
            </motion.button>
          </Link>

          <Link href="/app/challenges">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg text-center"
            >
              <span className="text-4xl">🏆</span>
              <div>
                <p className="text-white font-semibold">Challenges</p>
                <p className="text-white/80 text-xs">Join 7-30 day challenges</p>
              </div>
            </motion.button>
          </Link>

          <Link href="/app/marketplace">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg text-center"
            >
              <span className="text-4xl">🏪</span>
              <div>
                <p className="text-white font-semibold">Marketplace</p>
                <p className="text-white/80 text-xs">Browse community rituals</p>
              </div>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Your Loops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Your Ritual Loops</h2>
          <Link href="/app/loops">
            <span className="text-purple-400 hover:text-purple-300 text-sm cursor-pointer">
              View all →
            </span>
          </Link>
        </div>

        {loops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-gray-400 mb-4">No ritual loops yet</p>
            <Link href="/app/loops">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Create Your First Loop
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {loops.slice(0, 3).map((loop) => (
              <Link key={loop.id} href={`/app/loops/${loop.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">{loop.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>{loop.steps?.length || 0} steps</span>
                    <span>•</span>
                    <span>
                      {loop.steps?.reduce((acc: number, step: any) => acc + step.ritual.durationMinutes, 0) || 0}min total
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* AI Coach Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">AI Ritual Coach</h3>
            <p className="text-gray-400 mb-6">
              Describe what you're struggling with, and I'll suggest a personalized ritual loop.
            </p>
            <textarea
              placeholder="E.g., 'I can't stop scrolling social media before bed' or 'I feel anxious before meetings'"
              className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold"
              >
                Get Suggestions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAIModal(false)}
                className="px-4 py-3 bg-gray-700 text-gray-300 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

