'use client'

import { motion } from 'framer-motion'

interface AnimatedLoaderProps {
  message?: string
  type?: 'spinner' | 'dots' | 'pulse' | 'ritual'
}

export default function AnimatedLoader({ 
  message = 'Loading...', 
  type = 'ritual' 
}: AnimatedLoaderProps) {
  
  if (type === 'ritual') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        {/* Animated ritual circle */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-4 border-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ borderTopColor: 'transparent' }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 border-4 border-cyan-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ borderRightColor: 'transparent' }}
          />
          
          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 border-4 border-pink-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ borderBottomColor: 'transparent' }}
          />
          
          {/* Center icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-semibold mb-2"
        >
          {message}
        </motion.p>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className="flex gap-2 items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-purple-500 rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>
    )
  }

  return null
}

// Skeleton loader for content
export function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-700 rounded w-5/6" />
      <div className="h-32 bg-gray-700 rounded w-full" />
    </div>
  )
}

// Progress bar loader
interface ProgressLoaderProps {
  progress: number
  message?: string
}

export function ProgressLoader({ progress, message }: ProgressLoaderProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-white font-medium">{message || 'Loading...'}</span>
        <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}








