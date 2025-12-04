'use client'

/**
 * Ritual Player Page
 * 
 * Full-screen immersive experience for completing ritual loops
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import { getCategoryColor, formatDuration } from '@/lib/utils'

type Step = {
  id: string
  ritual: {
    name: string
    category: string
    durationMinutes: number
    description?: string
  }
}

export default function RitualPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  
  const [loop, setLoop] = useState<any>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [showMoodCheck, setShowMoodCheck] = useState(true)
  const [showReflection, setShowReflection] = useState(false)

  useEffect(() => {
    if (token) {
      fetchLoop()
    }
  }, [token, params.id])

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isPlaying && timeRemaining === 0) {
      handleStepComplete()
    }
  }, [isPlaying, timeRemaining])

  const fetchLoop = async () => {
    try {
      const response = await fetch(`/api/loops`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      const foundLoop = data.loops.find((l: any) => l.id === params.id)
      setLoop(foundLoop)
    } catch (error) {
      console.error('Failed to fetch loop:', error)
    }
  }

  const startRitual = () => {
    setShowMoodCheck(false)
    const firstStep = loop.steps[0]
    setTimeRemaining(firstStep.ritual.durationMinutes * 60)
    setIsPlaying(true)
  }

  const handleStepComplete = () => {
    setIsPlaying(false)
    
    if (currentStepIndex < loop.steps.length - 1) {
      // Move to next step
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
      setTimeRemaining(loop.steps[nextIndex].ritual.durationMinutes * 60)
      // Auto-start next step after brief pause
      setTimeout(() => setIsPlaying(true), 2000)
    } else {
      // All steps complete
      setIsCompleted(true)
      setShowReflection(true)
    }
  }

  const skipStep = () => {
    handleStepComplete()
  }

  const pauseResume = () => {
    setIsPlaying(!isPlaying)
  }

  const exitRitual = () => {
    router.push('/app')
  }

  if (!loop) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading ritual...</div>
      </div>
    )
  }

  const currentStep = loop.steps[currentStepIndex]
  const progress = ((currentStepIndex + (1 - timeRemaining / (currentStep.ritual.durationMinutes * 60))) / loop.steps.length) * 100

  // Initial mood check
  if (showMoodCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30"
        >
          <h2 className="text-3xl font-bold text-white mb-2">{loop.name}</h2>
          <p className="text-gray-400 mb-6">{loop.steps.length} steps • {formatDuration(loop.steps.reduce((acc: number, s: Step) => acc + s.ritual.durationMinutes, 0))}</p>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">How grounded do you feel right now?</h3>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMoodBefore(level)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    moodBefore === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Scattered</span>
              <span>Centered</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h3 className="text-white font-semibold mb-2">Steps:</h3>
            {loop.steps.map((step: Step, index: number) => (
              <div key={step.id} className="flex items-center gap-2 text-gray-300">
                <span className="text-purple-400">{index + 1}.</span>
                <span>{step.ritual.name}</span>
                <span className="text-gray-500 text-sm">({formatDuration(step.ritual.durationMinutes)})</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRitual}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg mb-3"
          >
            Begin Ritual
          </motion.button>
          
          <button
            onClick={exitRitual}
            className="w-full py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    )
  }

  // Reflection screen
  if (showReflection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-white mb-2">Ritual Complete!</h2>
            <p className="text-gray-400">You completed {loop.name}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">How grounded do you feel now?</h3>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMoodAfter(level)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    moodAfter === level
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Scattered</span>
              <span>Centered</span>
            </div>
          </div>

          {moodAfter > moodBefore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-center"
            >
              <p className="text-green-400 font-semibold">
                You're feeling more grounded! 🎉
              </p>
              <p className="text-green-300 text-sm mt-1">
                +{moodAfter - moodBefore} improvement
              </p>
            </motion.div>
          )}

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Quick reflection:</h3>
            <textarea
              placeholder="What shifted for you during this ritual?"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exitRitual}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-semibold rounded-lg"
          >
            Complete Ritual
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Main ritual player
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Step indicator */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-purple-400 font-semibold mb-4"
            >
              Step {currentStepIndex + 1} of {loop.steps.length}
            </motion.div>

            {/* Step name */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              {currentStep.ritual.name}
            </motion.h1>

            {/* Category */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <span className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentStep.ritual.category)} text-white font-semibold`}>
                {currentStep.ritual.category}
              </span>
            </motion.div>

            {/* Timer */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mb-8"
            >
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </div>
            </motion.div>

            {/* Description */}
            {currentStep.ritual.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 max-w-lg mx-auto"
              >
                {currentStep.ritual.description}
              </motion.p>
            )}

            {/* Breathing animation for certain categories */}
            {currentStep.ritual.category === 'Reset' && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
              />
            )}

            {/* Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={pauseResume}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors"
              >
                {isPlaying ? '⏸' : '▶️'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipStep}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors"
              >
                ⏭️
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={exitRitual}
                className="w-16 h-16 rounded-full bg-red-500/20 backdrop-blur-lg border border-red-500/30 flex items-center justify-center text-red-400 text-2xl hover:bg-red-500/30 transition-colors"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step list */}
      <div className="p-6 bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto">
          {loop.steps.map((step: Step, index: number) => (
            <div
              key={step.id}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                index === currentStepIndex
                  ? 'bg-purple-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <div className="text-xs opacity-75">{index + 1}</div>
              <div className="font-semibold text-sm">{step.ritual.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

