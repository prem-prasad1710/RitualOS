'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface StreakFireworksProps {
  streak: number
  onClose: () => void
}

export default function StreakFireworks({ streak, onClose }: StreakFireworksProps) {
  const isMilestone = streak % 7 === 0 || streak === 1

  if (!isMilestone) return null

  const getMessage = () => {
    if (streak === 1) return "🎉 First Day Complete!"
    if (streak === 7) return "🔥 One Week Streak!"
    if (streak === 30) return "💎 One Month Legend!"
    if (streak === 100) return "👑 Century Master!"
    return `🌟 ${streak} Day Streak!`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Fireworks particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: [
                  '#fbbf24',
                  '#f59e0b',
                  '#ef4444',
                  '#ec4899',
                  '#8b5cf6',
                  '#3b82f6',
                  '#10b981',
                ][i % 7],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 2, 0],
                x: Math.cos((i * Math.PI * 2) / 50) * (200 + Math.random() * 200),
                y: Math.sin((i * Math.PI * 2) / 50) * (200 + Math.random() * 200),
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>

        {/* Message card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative z-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            className="text-8xl mb-6"
          >
            {streak >= 100 ? '👑' : streak >= 30 ? '💎' : streak >= 7 ? '🔥' : '🎉'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {getMessage()}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 text-lg mb-6"
          >
            {streak === 1
              ? "You've started your journey to better habits!"
              : streak === 7
              ? "A full week of dedication. Keep it up!"
              : streak === 30
              ? "A month of consistency! You're unstoppable!"
              : streak === 100
              ? "100 days! You're a true ritual master!"
              : "Your dedication is paying off!"}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg"
          >
            Continue
          </motion.button>

          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-2xl"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 150,
                y: Math.sin((i * Math.PI * 2) / 8) * 150,
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}








