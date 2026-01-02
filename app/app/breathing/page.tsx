'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

type BreathingPattern = {
  id: string
  name: string
  description: string
  icon: string
  phases: {
    name: string
    duration: number
    color: string
  }[]
  benefits: string[]
  totalCycles: number
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Navy SEAL technique for stress relief',
    icon: '📦',
    phases: [
      { name: 'Breathe In', duration: 4, color: '#3B82F6' },
      { name: 'Hold', duration: 4, color: '#8B5CF6' },
      { name: 'Breathe Out', duration: 4, color: '#10B981' },
      { name: 'Hold', duration: 4, color: '#F59E0B' }
    ],
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    totalCycles: 4
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Dr. Weil\'s relaxation technique',
    icon: '😴',
    phases: [
      { name: 'Breathe In', duration: 4, color: '#3B82F6' },
      { name: 'Hold', duration: 7, color: '#8B5CF6' },
      { name: 'Breathe Out', duration: 8, color: '#10B981' }
    ],
    benefits: ['Helps with sleep', 'Reduces anxiety', 'Lowers blood pressure'],
    totalCycles: 4
  },
  {
    id: 'calm',
    name: 'Calm Breathing',
    description: 'Simple relaxation technique',
    icon: '🌊',
    phases: [
      { name: 'Breathe In', duration: 5, color: '#3B82F6' },
      { name: 'Breathe Out', duration: 5, color: '#10B981' }
    ],
    benefits: ['Quick relaxation', 'Eases tension', 'Mindfulness'],
    totalCycles: 6
  },
  {
    id: 'energize',
    name: 'Energizing Breath',
    description: 'Quick energy boost',
    icon: '⚡',
    phases: [
      { name: 'Quick In', duration: 2, color: '#F59E0B' },
      { name: 'Quick Out', duration: 2, color: '#EF4444' }
    ],
    benefits: ['Increases energy', 'Improves alertness', 'Mental clarity'],
    totalCycles: 10
  },
  {
    id: 'coherence',
    name: 'Heart Coherence',
    description: 'Balance mind and body',
    icon: '💓',
    phases: [
      { name: 'Breathe In', duration: 5, color: '#EC4899' },
      { name: 'Breathe Out', duration: 5, color: '#8B5CF6' }
    ],
    benefits: ['Emotional balance', 'Heart health', 'Reduces stress'],
    totalCycles: 6
  }
]

export default function BreathingPage() {
  const { user, isLoading } = useStore()
  const router = useRouter()
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [completedSessions, setCompletedSessions] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (isActive && selectedPattern) {
      const currentPhase = selectedPattern.phases[currentPhaseIndex]
      
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setTimeLeft(timeLeft - 1)
        }, 1000)
      } else {
        // Move to next phase
        const nextPhaseIndex = (currentPhaseIndex + 1) % selectedPattern.phases.length
        
        if (nextPhaseIndex === 0) {
          // Completed one cycle
          if (currentCycle >= selectedPattern.totalCycles) {
            // Session complete
            handleComplete()
            return
          } else {
            setCurrentCycle(currentCycle + 1)
          }
        }
        
        setCurrentPhaseIndex(nextPhaseIndex)
        setTimeLeft(selectedPattern.phases[nextPhaseIndex].duration)
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, timeLeft, currentPhaseIndex, currentCycle, selectedPattern])

  const startSession = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern)
    setCurrentPhaseIndex(0)
    setCurrentCycle(1)
    setTimeLeft(pattern.phases[0].duration)
    setIsActive(true)
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resumeSession = () => {
    setIsActive(true)
  }

  const stopSession = () => {
    setIsActive(false)
    setSelectedPattern(null)
    setCurrentPhaseIndex(0)
    setCurrentCycle(1)
    setTimeLeft(0)
  }

  const handleComplete = () => {
    setIsActive(false)
    setCompletedSessions(completedSessions + 1)
    
    // Show completion message
    setTimeout(() => {
      setSelectedPattern(null)
      setCurrentPhaseIndex(0)
      setCurrentCycle(1)
      setTimeLeft(0)
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {!selectedPattern ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold text-white mb-4">
                🫁 Breathing Exercises
              </h1>
              <p className="text-gray-300 text-lg">
                Guided breathing techniques for stress relief, focus, and energy
              </p>
              
              {completedSessions > 0 && (
                <div className="mt-6 inline-block bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20">
                  <span className="text-green-400 font-semibold">
                    ✓ {completedSessions} session{completedSessions !== 1 ? 's' : ''} completed today
                  </span>
                </div>
              )}
            </motion.div>

            {/* Pattern Selection Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breathingPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer hover:border-blue-500/50 transition"
                  onClick={() => startSession(pattern)}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{pattern.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pattern.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{pattern.description}</p>
                    
                    {/* Benefits */}
                    <div className="space-y-2 mb-4">
                      {pattern.benefits.map((benefit, i) => (
                        <div key={i} className="text-xs text-gray-400 flex items-center justify-center gap-2">
                          <span className="text-green-400">✓</span>
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Duration Info */}
                    <div className="text-sm text-gray-400">
                      {pattern.totalCycles} cycles • {Math.round(pattern.phases.reduce((sum, p) => sum + p.duration, 0) * pattern.totalCycles / 60)} min
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Breathing Animation */}
            <motion.div
              key={currentPhaseIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: selectedPattern.phases[currentPhaseIndex].name.includes('In') || 
                       selectedPattern.phases[currentPhaseIndex].name.includes('Hold') ? 1.3 : 0.8,
                opacity: 1
              }}
              transition={{ duration: selectedPattern.phases[currentPhaseIndex].duration }}
              className="relative w-64 h-64 mb-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${selectedPattern.phases[currentPhaseIndex].color}40, transparent)`,
                  boxShadow: `0 0 80px ${selectedPattern.phases[currentPhaseIndex].color}60`
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-8xl font-bold text-white mb-4"
                  >
                    {timeLeft}
                  </motion.div>
                  <div 
                    className="text-2xl font-semibold"
                    style={{ color: selectedPattern.phases[currentPhaseIndex].color }}
                  >
                    {selectedPattern.phases[currentPhaseIndex].name}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Info */}
            <div className="text-center mb-8">
              <div className="text-white text-xl mb-2">
                Cycle {currentCycle} of {selectedPattern.totalCycles}
              </div>
              <div className="w-64 bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentCycle / selectedPattern.totalCycles) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {isActive ? (
                <button
                  onClick={pauseSession}
                  className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-bold text-lg transition"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={resumeSession}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold text-lg transition"
                >
                  ▶️ Resume
                </button>
              )}
              
              <button
                onClick={stopSession}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-lg transition"
              >
                ⏹️ Stop
              </button>
            </div>

            {/* Pattern Info */}
            <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md">
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                {selectedPattern.name}
              </h3>
              <div className="space-y-2">
                {selectedPattern.benefits.map((benefit, i) => (
                  <div key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        <AnimatePresence>
          {!isActive && selectedPattern && currentCycle > selectedPattern.totalCycles && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl p-12 max-w-md text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, ease: 'linear' }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Session Complete!
                </h2>
                
                <p className="text-white/90 mb-6">
                  Great job completing {selectedPattern.name}. Your mind and body thank you!
                </p>

                <button
                  onClick={stopSession}
                  className="px-8 py-3 bg-white text-green-600 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


