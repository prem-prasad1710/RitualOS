'use client'

/**
 * Streak Tracker with Milestones & Celebrations
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Milestone {
  days: number
  title: string
  icon: string
  color: string
  reward: string
}

const milestones: Milestone[] = [
  { days: 3, title: 'Getting Started', icon: '🌱', color: 'from-green-400 to-emerald-500', reward: '+50 points' },
  { days: 7, title: 'Week Warrior', icon: '⚡', color: 'from-yellow-400 to-orange-500', reward: '+100 points' },
  { days: 14, title: 'Two Week Champion', icon: '🏅', color: 'from-blue-400 to-cyan-500', reward: '+200 points' },
  { days: 21, title: 'Habit Master', icon: '🎯', color: 'from-purple-400 to-pink-500', reward: '+300 points' },
  { days: 30, title: 'Month Legend', icon: '👑', color: 'from-amber-400 to-yellow-500', reward: '+500 points' },
  { days: 50, title: 'Dedication Pro', icon: '💎', color: 'from-cyan-400 to-blue-500', reward: '+750 points' },
  { days: 75, title: 'Elite Performer', icon: '🔥', color: 'from-red-400 to-pink-500', reward: '+1000 points' },
  { days: 100, title: 'Centurion', icon: '🏆', color: 'from-purple-500 to-indigo-600', reward: '+1500 points' },
]

interface Props {
  currentStreak: number
  longestStreak: number
  onStreakUpdate?: () => void
}

export default function StreakTracker({ currentStreak, longestStreak, onStreakUpdate }: Props) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [justAchieved, setJustAchieved] = useState<Milestone | null>(null)

  const nextMilestone = milestones.find(m => m.days > currentStreak) || milestones[milestones.length - 1]
  const achievedMilestones = milestones.filter(m => m.days <= currentStreak)
  const latestMilestone = achievedMilestones[achievedMilestones.length - 1]

  const progressToNext = ((currentStreak % nextMilestone.days) / nextMilestone.days) * 100

  useEffect(() => {
    // Check if user just achieved a milestone
    const lastAchieved = milestones.find(m => m.days === currentStreak)
    if (lastAchieved && currentStreak > 0) {
      setJustAchieved(lastAchieved)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 5000)
    }
  }, [currentStreak])

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <div className="relative bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-2xl p-8 overflow-hidden border border-purple-500/30">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="relative z-10">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mb-2">Current Streak</p>
            <motion.div
              key={currentStreak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-4"
            >
              <motion.span
                className="text-7xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                🔥
              </motion.span>
              <span className="text-6xl font-bold text-white">{currentStreak}</span>
            </motion.div>
            <p className="text-2xl font-semibold text-gray-300 mt-2">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </p>
          </div>

          {/* Progress to Next Milestone */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Next: {nextMilestone.title}</span>
              <span className="text-gray-300 font-semibold">
                {nextMilestone.days - currentStreak} days to go
              </span>
            </div>
            <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${nextMilestone.color}`}
              />
            </div>
          </div>

          {/* Longest Streak */}
          {longestStreak > currentStreak && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Personal Best: <span className="text-orange-400 font-bold">{longestStreak} days</span> 🏆
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Milestones</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map((milestone, index) => {
            const isAchieved = currentStreak >= milestone.days
            const isNext = milestone === nextMilestone

            return (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl p-4 border-2 transition-all ${
                  isAchieved
                    ? `bg-gradient-to-br ${milestone.color} border-transparent shadow-lg`
                    : isNext
                    ? 'bg-gray-800 border-purple-500/50'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                {isAchieved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">✓</span>
                  </motion.div>
                )}

                {isNext && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"
                  />
                )}

                <div className={`text-4xl mb-2 ${!isAchieved && 'opacity-30'}`}>
                  {milestone.icon}
                </div>
                <p className={`font-bold text-sm mb-1 ${isAchieved ? 'text-white' : 'text-gray-400'}`}>
                  {milestone.days} Days
                </p>
                <p className={`text-xs ${isAchieved ? 'text-white/90' : 'text-gray-500'}`}>
                  {milestone.title}
                </p>
                {isAchieved && (
                  <p className="text-xs text-white/80 mt-2 font-semibold">
                    {milestone.reward}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <motion.p
          key={currentStreak}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300 italic"
        >
          {currentStreak === 0 && "🌟 Start your streak today! Every journey begins with a single step."}
          {currentStreak >= 1 && currentStreak < 7 && "💪 You've started! Keep the momentum going!"}
          {currentStreak >= 7 && currentStreak < 21 && "🔥 You're building a real habit now. Don't break the chain!"}
          {currentStreak >= 21 && currentStreak < 50 && "⚡ Incredible dedication! You're in the top 10% of users!"}
          {currentStreak >= 50 && currentStreak < 100 && "🏆 You're a legend! Your consistency is inspiring!"}
          {currentStreak >= 100 && "👑 You've reached the elite! You ARE the top 1%!"}
        </motion.p>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && justAchieved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className={`bg-gradient-to-br ${justAchieved.color} rounded-2xl p-12 text-center max-w-md relative overflow-hidden`}
            >
              {/* Confetti particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: ['#fbbf24', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981'][i % 5],
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 400],
                    y: [0, (Math.random() - 0.5) * 400],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              ))}

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 1 }}
                className="text-8xl mb-6"
              >
                {justAchieved.icon}
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-4">
                Milestone Unlocked!
              </h2>
              <p className="text-2xl font-semibold text-white mb-2">
                {justAchieved.title}
              </p>
              <p className="text-xl text-white/90 mb-6">
                {justAchieved.days} Day Streak! 🎉
              </p>
              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <p className="text-white text-lg font-bold">
                  Reward: {justAchieved.reward}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCelebration(false)}
                className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg shadow-lg"
              >
                Awesome! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

