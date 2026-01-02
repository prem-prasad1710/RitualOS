'use client'

/**
 * Feature Demo Page
 * 
 * Showcases all the new awesome features and animations
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import BreathingExercise from '@/components/app/BreathingExercise'
import MoodTracker from '@/components/app/MoodTracker'
import AchievementBadges from '@/components/app/AchievementBadges'
import FocusTimer from '@/components/app/FocusTimer'
import ProgressVisualization from '@/components/app/ProgressVisualization'
import AnimatedLoader from '@/components/app/AnimatedLoader'
import StreakFireworks from '@/components/app/StreakFireworks'
import { ToastContainer } from '@/components/app/NotificationToast'
import Link from 'next/link'

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: any }>>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString()
    setNotifications([...notifications, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const features = [
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      icon: '🧘',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Calm your mind with guided breathing patterns',
    },
    {
      id: 'mood',
      name: 'Mood Tracker',
      icon: '😊',
      gradient: 'from-pink-500 to-rose-600',
      description: 'Track your emotions with beautiful animations',
    },
    {
      id: 'timer',
      name: 'Focus Timer',
      icon: '⏱️',
      gradient: 'from-orange-500 to-red-600',
      description: 'Deep work sessions with ambient sounds',
    },
    {
      id: 'achievements',
      name: 'Achievement Badges',
      icon: '🏆',
      gradient: 'from-yellow-500 to-amber-600',
      description: 'Unlock beautiful badges as you progress',
    },
    {
      id: 'progress',
      name: 'Progress Charts',
      icon: '📊',
      gradient: 'from-green-500 to-teal-600',
      description: 'Visualize your journey with stunning charts',
    },
    {
      id: 'loader',
      name: 'Loading Animations',
      icon: '✨',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Beautiful loading states and transitions',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Toast Container */}
      <ToastContainer notifications={notifications} onRemove={removeNotification} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            ✨ New Features Demo
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Explore all the awesome new features and animations
          </p>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.button
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
            onClick={() => setActiveDemo(feature.id)}
            className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 text-left relative overflow-hidden group`}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />

            <div className="relative z-10">
              <motion.div
                className="text-6xl mb-4"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Demo Actions */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Try These Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addNotification('Success! You did it! 🎉', 'success')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
          >
            Success Toast
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addNotification('Oops! Something went wrong', 'error')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold"
          >
            Error Toast
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addNotification('Hey! Check this out 👀', 'info')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Info Toast
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFireworks(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
          >
            Streak Fireworks
          </motion.button>
        </div>
      </div>

      {/* Animation Showcase */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Animation Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Float */}
          <div className="bg-gray-700 rounded-xl p-6 text-center">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🎈
            </motion.div>
            <p className="text-white font-semibold">Float</p>
          </div>

          {/* Pulse */}
          <div className="bg-gray-700 rounded-xl p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              💫
            </motion.div>
            <p className="text-white font-semibold">Pulse</p>
          </div>

          {/* Rotate */}
          <div className="bg-gray-700 rounded-xl p-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-5xl mb-4"
            >
              ⚙️
            </motion.div>
            <p className="text-white font-semibold">Rotate</p>
          </div>

          {/* Wiggle */}
          <div className="bg-gray-700 rounded-xl p-6 text-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-5xl mb-4"
            >
              🔔
            </motion.div>
            <p className="text-white font-semibold">Wiggle</p>
          </div>
        </div>
      </div>

      {/* Feature Modals */}
      {activeDemo === 'breathing' && (
        <BreathingExercise onClose={() => setActiveDemo(null)} />
      )}

      {activeDemo === 'mood' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setActiveDemo(null)}>
          <div className="max-w-4xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
              <MoodTracker />
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'timer' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setActiveDemo(null)}>
          <div className="max-w-4xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>
              <FocusTimer />
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'achievements' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setActiveDemo(null)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>
              <AchievementBadges totalSessions={25} streak={7} totalLoops={5} />
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'progress' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={() => setActiveDemo(null)}>
          <div className="max-w-7xl mx-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>
              <ProgressVisualization sessions={[]} />
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'loader' && (
        <div className="fixed inset-0 bg-black/90 z-50">
          <AnimatedLoader message="Loading your rituals..." type="ritual" />
        </div>
      )}

      {showFireworks && (
        <StreakFireworks streak={7} onClose={() => setShowFireworks(false)} />
      )}
    </div>
  )
}








