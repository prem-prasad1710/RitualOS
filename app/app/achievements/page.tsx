'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement: number
  points: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
}

export default function AchievementsPage() {
  const { user, isLoading } = useStore()
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratedAchievement, setCelebratedAchievement] = useState<Achievement | null>(null)

  const categories = ['All', 'Streak', 'Completion', 'Social', 'Special']

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchAchievements()
    }
  }, [user])

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements)
        
        // Check for newly unlocked achievements
        const newlyUnlocked = data.achievements.find((a: Achievement) => 
          a.unlocked && !localStorage.getItem(`achievement_celebrated_${a.id}`)
        )
        
        if (newlyUnlocked) {
          celebrate(newlyUnlocked)
          localStorage.setItem(`achievement_celebrated_${newlyUnlocked.id}`, 'true')
        }
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const celebrate = (achievement: Achievement) => {
    setCelebratedAchievement(achievement)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 5000)
  }

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0)

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🏅 Achievements
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Unlock badges and earn points by completing rituals and challenges
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-yellow-400">{unlockedCount}</div>
              <div className="text-gray-300 text-sm">Achievements Unlocked</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-purple-400">{totalPoints}</div>
              <div className="text-gray-300 text-sm">Points Earned</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-cyan-400">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="text-gray-300 text-sm">Completion Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 mb-8 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border ${
                achievement.unlocked
                  ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                  : 'border-white/20 grayscale opacity-60'
              }`}
            >
              {/* Unlocked Badge */}
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="absolute -top-3 -right-3 bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg"
                >
                  ✓
                </motion.div>
              )}

              <div className="text-center">
                {/* Icon */}
                <motion.div
                  animate={achievement.unlocked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  {achievement.icon}
                </motion.div>

                {/* Name & Description */}
                <h3 className={`text-xl font-bold mb-2 ${
                  achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>

                {/* Category & Points */}
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-300 text-xs">
                    {achievement.category}
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/30 rounded-full text-yellow-300 text-xs">
                    {achievement.points} pts
                  </span>
                </div>

                {/* Progress Bar (for locked achievements) */}
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                )}

                {/* Unlocked Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-400 mt-3">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            <div className="text-6xl mb-4">🏅</div>
            <h3 className="text-2xl font-semibold mb-2">No achievements in this category</h3>
            <p>Try selecting a different category</p>
          </motion.div>
        )}

        {/* Celebration Modal */}
        <AnimatePresence>
          {showCelebration && celebratedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-12 max-w-md text-center relative overflow-hidden"
              >
                {/* Confetti Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
                      animate={{ 
                        y: 600, 
                        x: Math.random() * 400 - 200,
                        rotate: Math.random() * 360,
                        opacity: 0
                      }}
                      transition={{ duration: 2, delay: Math.random() * 0.5 }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'][Math.floor(Math.random() * 4)]
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl mb-6"
                >
                  {celebratedAchievement.icon}
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-4">
                  Achievement Unlocked!
                </h2>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {celebratedAchievement.name}
                </h3>

                <p className="text-white/90 mb-6">
                  {celebratedAchievement.description}
                </p>

                <div className="text-3xl font-bold text-white mb-6">
                  +{celebratedAchievement.points} Points
                </div>

                <button
                  onClick={() => setShowCelebration(false)}
                  className="px-8 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  Awesome!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


