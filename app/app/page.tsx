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
import BreathingExercise from '@/components/app/BreathingExercise'
import MoodTracker from '@/components/app/MoodTracker'
import AchievementBadges from '@/components/app/AchievementBadges'
import FocusTimer from '@/components/app/FocusTimer'
import ProgressVisualization from '@/components/app/ProgressVisualization'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [sessions, setSessions] = useState<any[]>([])
  const [loops, setLoops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showFocusTimer, setShowFocusTimer] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

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
    <div className="p-8 relative">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500 rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <motion.h1
          className="text-4xl font-bold text-white mb-2"
          animate={{
            textShadow: [
              '0 0 20px rgba(102, 126, 234, 0.3)',
              '0 0 30px rgba(34, 211, 238, 0.4)',
              '0 0 20px rgba(102, 126, 234, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {getGreeting()}, {user?.name}
        </motion.h1>
        <p className="text-gray-400">
          {user?.focusGoal ? `Focused on ${user.focusGoal}` : 'Ready to create your first ritual?'}
        </p>
      </motion.div>

      {/* Stats with 3D card effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            rotateX: 5,
            boxShadow: '0 25px 50px rgba(147, 51, 234, 0.4)',
          }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg cursor-pointer transform-gpu perspective-1000"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Ritual Streak</p>
              <motion.p 
                className="text-4xl font-bold text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {streak}
              </motion.p>
              <p className="text-purple-200 text-sm mt-1">days</p>
            </div>
            <motion.div 
              className="text-5xl"
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🔥
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            rotateX: 5,
            boxShadow: '0 25px 50px rgba(8, 145, 178, 0.4)',
          }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 shadow-lg cursor-pointer transform-gpu"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(8, 145, 178, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm mb-1">Today's Rituals</p>
              <motion.p 
                className="text-4xl font-bold text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                {completedToday}
              </motion.p>
              <p className="text-cyan-200 text-sm mt-1">completed</p>
            </div>
            <motion.div 
              className="text-5xl"
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            rotateX: 5,
            boxShadow: '0 25px 50px rgba(5, 150, 105, 0.4)',
          }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg cursor-pointer transform-gpu"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(5, 150, 105, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm mb-1">Total Loops</p>
              <motion.p 
                className="text-4xl font-bold text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                {loops.length}
              </motion.p>
              <p className="text-green-200 text-sm mt-1">created</p>
            </div>
            <motion.div 
              className="text-5xl"
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              🔄
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 mb-8 relative z-10"
        style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBreathing(true)}
            className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-center relative overflow-hidden group"
            style={{ boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-4xl z-10">🧘</span>
            <div className="z-10">
              <p className="text-white font-semibold">Breathing</p>
              <p className="text-white/80 text-xs">Calm your mind</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMoodTracker(true)}
            className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg text-center relative overflow-hidden group"
            style={{ boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-4xl z-10">😊</span>
            <div className="z-10">
              <p className="text-white font-semibold">Mood Tracker</p>
              <p className="text-white/80 text-xs">Log your feelings</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFocusTimer(true)}
            className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg text-center relative overflow-hidden group"
            style={{ boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-4xl z-10">⏱️</span>
            <div className="z-10">
              <p className="text-white font-semibold">Focus Timer</p>
              <p className="text-white/80 text-xs">Deep work session</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAchievements(true)}
            className="w-full flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg text-center relative overflow-hidden group"
            style={{ boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)' }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-4xl z-10">🏆</span>
            <div className="z-10">
              <p className="text-white font-semibold">Achievements</p>
              <p className="text-white/80 text-xs">View your badges</p>
            </div>
          </motion.button>
        </div>

        {/* Original quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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

      {/* New Feature Modals */}
      {showBreathing && (
        <div className="fixed inset-0 z-50">
          <BreathingExercise onClose={() => setShowBreathing(false)} />
        </div>
      )}

      {showMoodTracker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowMoodTracker(false)}>
          <div className="max-w-4xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setShowMoodTracker(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
              <MoodTracker />
            </div>
          </div>
        </div>
      )}

      {showFocusTimer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowFocusTimer(false)}>
          <div className="max-w-4xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setShowFocusTimer(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                ✕
              </button>
              <FocusTimer />
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowAchievements(false)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setShowAchievements(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                ✕
              </button>
              <AchievementBadges totalSessions={sessions.length} streak={streak} totalLoops={loops.length} />
            </div>
          </div>
        </div>
      )}

      {/* Progress visualization button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowProgress(!showProgress)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full shadow-lg flex items-center justify-center text-2xl z-40"
        style={{ boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)' }}
      >
        📊
      </motion.button>

      {showProgress && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setShowProgress(false)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setShowProgress(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                ✕
              </button>
              <ProgressVisualization sessions={sessions} />
            </div>
          </div>
        </div>
      )}

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

