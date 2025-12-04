'use client'

/**
 * Quick Ritual Mode
 * 
 * Emergency anxiety relief - one-tap access to calming rituals
 * Perfect for moments of overwhelm, anxiety, or stress
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const quickRituals = [
  {
    id: '1',
    name: '3-Minute Calm',
    description: 'Instant anxiety relief through breathing',
    category: 'Anxiety',
    duration: 3,
    icon: '🌊',
    color: 'from-blue-500 to-cyan-500',
    steps: [
      'Find a comfortable position',
      'Close your eyes or soften your gaze',
      'Breathe in for 4 counts',
      'Hold for 4 counts',
      'Breathe out for 6 counts',
      'Repeat until you feel grounded'
    ]
  },
  {
    id: '2',
    name: 'Stress Reset',
    description: 'Release tension in body and mind',
    category: 'Stress',
    duration: 5,
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
    steps: [
      'Stand up and shake out your hands',
      'Roll your shoulders back 5 times',
      'Take 3 deep breaths',
      'Name 3 things you can see',
      'Name 2 things you can hear',
      'Name 1 thing you can touch'
    ]
  },
  {
    id: '3',
    name: 'Focus Now',
    description: 'Snap into clarity in 2 minutes',
    category: 'Focus',
    duration: 2,
    icon: '🎯',
    color: 'from-purple-500 to-pink-500',
    steps: [
      'Close all tabs except one',
      'Write down: What am I focusing on?',
      'Write down: Why does it matter?',
      'Set a timer for 25 minutes',
      'Begin immediately'
    ]
  },
  {
    id: '4',
    name: 'Energy Boost',
    description: 'Wake up your mind and body',
    category: 'Energy',
    duration: 4,
    icon: '💪',
    color: 'from-green-500 to-teal-500',
    steps: [
      'Do 10 jumping jacks',
      'Drink a glass of water',
      'Step outside for fresh air',
      'Do 5 deep breaths',
      'Smile (yes, really!)'
    ]
  }
]

export default function QuickRitualPage() {
  const router = useRouter()
  const [selectedRitual, setSelectedRitual] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const startRitual = (ritual: any) => {
    setSelectedRitual(ritual)
    setCurrentStep(0)
    setIsActive(true)
  }

  const nextStep = () => {
    if (currentStep < selectedRitual.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete
      setIsActive(false)
      setSelectedRitual(null)
      setCurrentStep(0)
    }
  }

  const exit = () => {
    setIsActive(false)
    setSelectedRitual(null)
    setCurrentStep(0)
  }

  if (isActive && selectedRitual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 10 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Step indicator */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-purple-400 font-semibold mb-4"
            >
              Step {currentStep + 1} of {selectedRitual.steps.length}
            </motion.div>

            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-9xl mb-8"
            >
              {selectedRitual.icon}
            </motion.div>

            {/* Step text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-8"
            >
              {selectedRitual.steps[currentStep]}
            </motion.h1>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${selectedRitual.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / selectedRitual.steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exit}
                className="px-8 py-4 bg-gray-800 text-gray-300 rounded-lg font-semibold"
              >
                Exit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className={`px-12 py-4 bg-gradient-to-r ${selectedRitual.color} text-white rounded-lg font-semibold shadow-lg`}
              >
                {currentStep < selectedRitual.steps.length - 1 ? 'Next Step' : 'Complete'}
              </motion.button>
            </motion.div>

            {/* Breathing animation for anxiety rituals */}
            {selectedRitual.category === 'Anxiety' && (
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur-3xl"
              />
            )}
          </motion.div>
        </AnimatePresence>
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
        <h1 className="text-4xl font-bold text-white mb-2">⚡ Quick Rituals</h1>
        <p className="text-gray-400 text-lg">
          Feeling overwhelmed? Choose a quick ritual for instant relief.
        </p>
      </motion.div>

      {/* Emergency banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🆘</span>
          <h2 className="text-2xl font-bold text-white">Need Help Right Now?</h2>
        </div>
        <p className="text-gray-300">
          These rituals are designed for moments when you need immediate support. 
          They're quick, effective, and scientifically backed.
        </p>
      </motion.div>

      {/* Quick ritual cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickRituals.map((ritual, index) => (
          <motion.div
            key={ritual.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${ritual.color} rounded-xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden`}
            onClick={() => startRitual(ritual)}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-3">
                    {ritual.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-2">{ritual.name}</h3>
                  <p className="text-white/90 mb-4">{ritual.description}</p>
                </div>
                <span className="text-6xl">{ritual.icon}</span>
              </div>

              <div className="flex items-center justify-between text-white/80 text-sm mb-6">
                <span>⏱️ {ritual.duration} minutes</span>
                <span>{ritual.steps.length} steps</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg shadow-lg"
              >
                Start Now →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-gray-800 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">💡 When to Use Quick Rituals</h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-2">Perfect For:</h3>
            <ul className="space-y-2">
              <li>• Panic attacks or anxiety spikes</li>
              <li>• Feeling overwhelmed at work</li>
              <li>• Can't focus on anything</li>
              <li>• Sudden stress or bad news</li>
              <li>• Before important events</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Pro Tips:</h3>
            <ul className="space-y-2">
              <li>• Find a quiet space if possible</li>
              <li>• Turn off notifications</li>
              <li>• Follow each step fully</li>
              <li>• Don't rush the process</li>
              <li>• Use as often as needed</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <button
          onClick={() => router.push('/app')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>
      </motion.div>
    </div>
  )
}

