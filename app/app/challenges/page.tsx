'use client'

/**
 * Challenges Page - Fully Functional
 * 
 * 7-day, 14-day, and 30-day ritual challenges to build consistency
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

interface Challenge {
  id: string
  name: string
  description: string
  duration: number
  difficulty: string
  points: number
  goal: string
  benefits: string[]
  icon: string
  color: string
}

interface UserChallenge {
  id: string
  challengeId: string
  status: string
  currentStreak: number
  completedDays: number
  checkIns: string[]
  startedAt: string
  completedAt?: string
  challenge: Challenge
}

export default function ChallengesPage() {
  const router = useRouter()
  const { token } = useStore()
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available')
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<UserChallenge[]>([])
  const [stats, setStats] = useState({ activeCount: 0, completedCount: 0, totalPointsEarned: 0 })
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  // Fetch challenges
  useEffect(() => {
    fetchChallenges()
    fetchMyChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      
      if (data.challenges) {
        setChallenges(data.challenges)
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyChallenges = async () => {
    if (!token) return

    try {
      const response = await fetch('/api/challenges/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.active) {
        setActiveChallenges(data.active)
        setCompletedChallenges(data.completed)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching my challenges:', error)
    }
  }

  const joinChallenge = async (challenge: Challenge) => {
    if (!token) {
      alert('Please log in to join challenges')
      router.push('/login')
      return
    }

    setJoining(true)
    try {
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ challengeId: challenge.id })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`🎉 You've joined the ${challenge.name} challenge!\n\nGo to Active tab to track your progress.`)
        setSelectedChallenge(null)
        fetchMyChallenges() // Refresh user challenges
        setActiveTab('active')
      } else {
        alert(data.error || 'Failed to join challenge')
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      alert('Failed to join challenge')
    } finally {
      setJoining(false)
    }
  }

  const checkIn = async (userChallengeId: string) => {
    if (!token) return

    try {
      const response = await fetch('/api/challenges/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userChallengeId })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.completed) {
          alert(`🎉 Challenge Completed!\n\nYou earned ${data.pointsEarned} points!`)
        } else {
          alert('✅ Check-in successful!')
        }
        fetchMyChallenges() // Refresh
      } else {
        alert(data.error || 'Failed to check in')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      alert('Failed to check in')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading challenges...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Ritual Challenges</h1>
        <p className="text-gray-400 text-lg">
          Join challenges to build consistency and earn rewards
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6"
        >
          <div className="text-purple-200 text-sm mb-1">Active Challenges</div>
          <div className="text-4xl font-bold text-white">{stats.activeCount}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6"
        >
          <div className="text-green-200 text-sm mb-1">Completed</div>
          <div className="text-4xl font-bold text-white">{stats.completedCount}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6"
        >
          <div className="text-cyan-200 text-sm mb-1">Total Points Earned</div>
          <div className="text-4xl font-bold text-white">{stats.totalPointsEarned}</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['available', 'active', 'completed'] as const).map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Available Challenges */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center text-3xl`}>
                    {challenge.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white font-semibold">{challenge.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Reward:</span>
                  <span className="text-purple-400 font-semibold">+{challenge.points} points</span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-3 mb-4">
                <div className="text-gray-400 text-xs mb-1">GOAL</div>
                <div className="text-white text-sm">{challenge.goal}</div>
              </div>

              <div className="mb-4">
                <div className="text-gray-400 text-xs mb-2">BENEFITS</div>
                <ul className="space-y-1">
                  {challenge.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChallenge(challenge)}
                className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${challenge.color} text-white`}
              >
                Join Challenge
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeChallenges.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No active challenges. Join one from the Available tab!
            </div>
          ) : (
            activeChallenges.map((uc, index) => (
              <motion.div
                key={uc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${uc.challenge.color} flex items-center justify-center text-3xl`}>
                    {uc.challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{uc.challenge.name}</h3>
                    <p className="text-gray-400 text-sm">{uc.challenge.duration} day challenge</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-semibold">
                      {uc.completedDays} / {uc.challenge.duration} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${uc.challenge.color} transition-all`}
                      style={{ width: `${(uc.completedDays / uc.challenge.duration) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Current Streak</div>
                    <div className="text-white text-xl font-bold">{uc.currentStreak} 🔥</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Points to Earn</div>
                    <div className="text-purple-400 text-xl font-bold">{uc.challenge.points}</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => checkIn(uc.id)}
                  className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors"
                >
                  ✓ Check In Today
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {completedChallenges.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No completed challenges yet. Keep going!
            </div>
          ) : (
            completedChallenges.map((uc, index) => (
              <motion.div
                key={uc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-gray-800 rounded-xl p-6 border-2 border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${uc.challenge.color} flex items-center justify-center text-3xl`}>
                    {uc.challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {uc.challenge.name}
                      <span className="text-2xl">✅</span>
                    </h3>
                    <p className="text-green-400 text-sm">Completed!</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Days Completed</div>
                    <div className="text-white text-xl font-bold">{uc.completedDays}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Points Earned</div>
                    <div className="text-purple-400 text-xl font-bold">+{uc.challenge.points}</div>
                  </div>
                </div>

                <div className="text-center text-gray-400 text-sm">
                  Completed on {new Date(uc.completedAt!).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Challenge detail modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${selectedChallenge.color} flex items-center justify-center text-4xl mb-4`}>
                  {selectedChallenge.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedChallenge.name}</h2>
                <p className="text-gray-400">{selectedChallenge.duration} Day Challenge</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-2">Ready to commit?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  You'll need to {selectedChallenge.goal.toLowerCase()} to earn {selectedChallenge.points} points.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Daily check-ins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Achievement on completion</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => joinChallenge(selectedChallenge)}
                  disabled={joining}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r ${selectedChallenge.color} text-white disabled:opacity-50`}
                >
                  {joining ? 'Joining...' : 'Start Challenge'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChallenge(null)}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
