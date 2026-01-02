'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  unlocked: boolean
  progress: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const getRarityColors = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common':
      return {
        bg: 'from-gray-600 to-gray-700',
        border: 'border-gray-500',
        glow: 'shadow-gray-500/50',
      }
    case 'rare':
      return {
        bg: 'from-blue-600 to-blue-700',
        border: 'border-blue-500',
        glow: 'shadow-blue-500/50',
      }
    case 'epic':
      return {
        bg: 'from-purple-600 to-purple-700',
        border: 'border-purple-500',
        glow: 'shadow-purple-500/50',
      }
    case 'legendary':
      return {
        bg: 'from-yellow-500 to-orange-600',
        border: 'border-yellow-500',
        glow: 'shadow-yellow-500/50',
      }
  }
}

interface AchievementBadgesProps {
  totalSessions?: number
  streak?: number
  totalLoops?: number
}

export default function AchievementBadges({ 
  totalSessions = 0, 
  streak = 0, 
  totalLoops = 0 
}: AchievementBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'first-ritual',
      name: 'First Steps',
      description: 'Complete your first ritual',
      icon: '🌱',
      requirement: 1,
      unlocked: totalSessions >= 1,
      progress: Math.min(totalSessions, 1),
      rarity: 'common',
    },
    {
      id: 'ritual-apprentice',
      name: 'Ritual Apprentice',
      description: 'Complete 10 rituals',
      icon: '⭐',
      requirement: 10,
      unlocked: totalSessions >= 10,
      progress: Math.min(totalSessions, 10),
      rarity: 'common',
    },
    {
      id: 'ritual-master',
      name: 'Ritual Master',
      description: 'Complete 50 rituals',
      icon: '🏆',
      requirement: 50,
      unlocked: totalSessions >= 50,
      progress: Math.min(totalSessions, 50),
      rarity: 'rare',
    },
    {
      id: 'ritual-legend',
      name: 'Ritual Legend',
      description: 'Complete 100 rituals',
      icon: '👑',
      requirement: 100,
      unlocked: totalSessions >= 100,
      progress: Math.min(totalSessions, 100),
      rarity: 'epic',
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      requirement: 7,
      unlocked: streak >= 7,
      progress: Math.min(streak, 7),
      rarity: 'rare',
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '💎',
      requirement: 30,
      unlocked: streak >= 30,
      progress: Math.min(streak, 30),
      rarity: 'epic',
    },
    {
      id: 'eternal-flame',
      name: 'Eternal Flame',
      description: 'Maintain a 100-day streak',
      icon: '🌟',
      requirement: 100,
      unlocked: streak >= 100,
      progress: Math.min(streak, 100),
      rarity: 'legendary',
    },
    {
      id: 'loop-creator',
      name: 'Loop Creator',
      description: 'Create 5 ritual loops',
      icon: '🔄',
      requirement: 5,
      unlocked: totalLoops >= 5,
      progress: Math.min(totalLoops, 5),
      rarity: 'rare',
    },
    {
      id: 'loop-architect',
      name: 'Loop Architect',
      description: 'Create 15 ritual loops',
      icon: '🏗️',
      requirement: 15,
      unlocked: totalLoops >= 15,
      progress: Math.min(totalLoops, 15),
      rarity: 'epic',
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete a ritual before 7 AM',
      icon: '🌅',
      requirement: 1,
      unlocked: false, // Would need to track time
      progress: 0,
      rarity: 'common',
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete a ritual after 10 PM',
      icon: '🦉',
      requirement: 1,
      unlocked: false,
      progress: 0,
      rarity: 'common',
    },
  ])

  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  useEffect(() => {
    // Update badges based on props
    setBadges((prev) =>
      prev.map((badge) => {
        const wasUnlocked = badge.unlocked
        let newProgress = badge.progress
        let newUnlocked = badge.unlocked

        if (badge.id.includes('ritual-')) {
          newProgress = Math.min(totalSessions, badge.requirement)
          newUnlocked = totalSessions >= badge.requirement
        } else if (badge.id.includes('week') || badge.id.includes('month') || badge.id.includes('flame')) {
          newProgress = Math.min(streak, badge.requirement)
          newUnlocked = streak >= badge.requirement
        } else if (badge.id.includes('loop')) {
          newProgress = Math.min(totalLoops, badge.requirement)
          newUnlocked = totalLoops >= badge.requirement
        }

        // Show unlock animation for newly unlocked badges
        if (!wasUnlocked && newUnlocked) {
          setShowUnlockAnimation(badge.id)
          setTimeout(() => setShowUnlockAnimation(null), 3000)
        }

        return { ...badge, progress: newProgress, unlocked: newUnlocked }
      })
    )
  }, [totalSessions, streak, totalLoops])

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'unlocked') return badge.unlocked
    if (filter === 'locked') return !badge.unlocked
    return true
  })

  const unlockedCount = badges.filter((b) => b.unlocked).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Achievements</h2>
            <p className="text-gray-300">
              {unlockedCount} of {badges.length} unlocked
            </p>
          </div>
          <div className="text-6xl">🏅</div>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-500"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'unlocked', 'locked'] as const).map((filterOption) => (
          <motion.button
            key={filterOption}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filter === filterOption
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filterOption}
          </motion.button>
        ))}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge, index) => {
            const colors = getRarityColors(badge.rarity)
            const isUnlocking = showUnlockAnimation === badge.id

            return (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <motion.div
                  whileHover={badge.unlocked ? { y: -4, scale: 1.02 } : {}}
                  className={`relative p-6 rounded-xl border-2 ${colors.border} ${
                    badge.unlocked
                      ? `bg-gradient-to-br ${colors.bg} ${colors.glow} shadow-lg`
                      : 'bg-gray-800/50 grayscale opacity-60'
                  } transition-all`}
                >
                  {/* Unlock animation */}
                  {isUnlocking && (
                    <>
                      <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 1 }}
                        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-xl`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                            initial={{ x: 0, y: 0, opacity: 1 }}
                            animate={{
                              x: Math.cos((i * Math.PI * 2) / 12) * 100,
                              y: Math.sin((i * Math.PI * 2) / 12) * 100,
                              opacity: 0,
                            }}
                            transition={{ duration: 1 }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Badge content */}
                  <div className="relative z-10">
                    <motion.div
                      animate={isUnlocking ? { 
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                      } : {}}
                      transition={{ duration: 0.6 }}
                      className="text-6xl mb-3"
                    >
                      {badge.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{badge.description}</p>

                    {/* Progress bar for locked badges */}
                    {!badge.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>
                            {badge.progress}/{badge.requirement}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(badge.progress / badge.requirement) * 100}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Rarity badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                          badge.unlocked ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {badge.rarity}
                      </span>
                    </div>

                    {badge.unlocked && (
                      <div className="absolute top-2 left-2">
                        <span className="text-2xl">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-gray-400">No {filter} badges yet</p>
        </div>
      )}
    </div>
  )
}








