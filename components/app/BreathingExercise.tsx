'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BreathingExerciseProps {
  onClose: () => void
}

export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [count, setCount] = useState(4)
  const [isActive, setIsActive] = useState(false)
  const [totalBreaths, setTotalBreaths] = useState(0)
  const [pattern, setPattern] = useState({ inhale: 4, hold: 4, exhale: 4, pause: 2 })

  const patterns = {
    'Box Breathing': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    '4-7-8 Technique': { inhale: 4, hold: 7, exhale: 8, pause: 2 },
    'Calm Breathing': { inhale: 4, hold: 4, exhale: 6, pause: 2 },
    'Energizing': { inhale: 3, hold: 3, exhale: 3, pause: 1 },
  }

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1
        
        // Move to next phase
        switch (phase) {
          case 'inhale':
            setPhase('hold')
            return pattern.hold
          case 'hold':
            setPhase('exhale')
            return pattern.exhale
          case 'exhale':
            setPhase('pause')
            setTotalBreaths((prev) => prev + 1)
            return pattern.pause
          case 'pause':
            setPhase('inhale')
            return pattern.inhale
          default:
            return pattern.inhale
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, pattern])

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.8
      case 'hold': return 1.8
      case 'exhale': return 0.5
      case 'pause': return 0.5
      default: return 1
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-cyan-500 to-blue-500'
      case 'hold': return 'from-purple-500 to-pink-500'
      case 'exhale': return 'from-green-500 to-teal-500'
      case 'pause': return 'from-yellow-500 to-orange-500'
      default: return 'from-purple-500 to-cyan-500'
    }
  }

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
      case 'pause': return 'Pause'
      default: return 'Ready'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ✕
        </button>

        {/* Pattern selector */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {Object.entries(patterns).map(([name, patternConfig]) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPattern(patternConfig)
                setIsActive(false)
                setPhase('inhale')
                setCount(patternConfig.inhale)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pattern === patternConfig
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {name}
            </motion.button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className="relative w-full aspect-square max-w-md mx-auto mb-8">
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${getPhaseColor()} rounded-full blur-3xl opacity-50`}
            animate={{ scale: getCircleScale() }}
            transition={{ duration: count, ease: 'linear' }}
          />
          
          {/* Main circle */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${getPhaseColor()} rounded-full flex items-center justify-center`}
            animate={{ scale: getCircleScale() }}
            transition={{ duration: count, ease: 'linear' }}
          >
            <div className="text-center">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl font-bold mb-2"
              >
                {getPhaseInstruction()}
              </motion.p>
              <motion.p
                key={`${phase}-${count}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-white text-7xl font-bold"
              >
                {count}
              </motion.p>
            </div>
          </motion.div>

          {/* Particles */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI * 2) / 12) * 200],
                    y: [0, Math.sin((i * Math.PI * 2) / 12) * 200],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
            }`}
          >
            {isActive ? 'Pause' : 'Start Breathing'}
          </motion.button>

          <div className="flex items-center justify-center gap-8 text-gray-300">
            <div className="text-center">
              <p className="text-sm opacity-60">Total Breaths</p>
              <p className="text-2xl font-bold">{totalBreaths}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-60">Duration</p>
              <p className="text-2xl font-bold">
                {Math.floor((totalBreaths * (pattern.inhale + pattern.hold + pattern.exhale + pattern.pause)) / 60)}m
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-gray-800/50 rounded-xl"
        >
          <p className="text-gray-300 text-sm text-center">
            💡 Find a comfortable position. Close your eyes or soften your gaze. 
            Let your shoulders relax with each exhale.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}




