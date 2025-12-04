'use client'

/**
 * Challenges Page
 * 
 * 7-day, 14-day, and 30-day ritual challenges to build consistency
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const challenges = [
  {
    id: '1',
    name: 'Morning Momentum',
    description: 'Start every day with a 5-minute focus ritual',
    duration: 7,
    difficulty: 'Easy',
    points: 100,
    icon: '🌅',
    color: 'from-orange-500 to-yellow-500',
    goal: 'Complete a morning ritual 7 days in a row',
    benefits: [
      'Build consistent morning routine',
      'Improve focus throughout the day',
      'Reduce morning anxiety'
    ]
  },
  {
    id: '2',
    name: 'Digital Detox',
    description: 'Replace evening scrolling with a wind-down ritual',
    duration: 14,
    difficulty: 'Medium',
    points: 250,
    icon: '📵',
    color: 'from-blue-500 to-purple-500',
    goal: 'Complete a screen-free evening ritual for 14 days',
    benefits: [
      'Better sleep quality',
      'Reduced phone dependency',
      'More present evenings'
    ]
  },
  {
    id: '3',
    name: 'Focus Mastery',
    description: 'Complete a deep focus loop every workday',
    duration: 21,
    difficulty: 'Medium',
    points: 350,
    icon: '🎯',
    color: 'from-purple-500 to-pink-500',
    goal: 'Do a focus ritual before work for 21 days',
    benefits: [
      'Dramatically improve concentration',
      'Reduce context-switching',
      'Build deep work capacity'
    ]
  },
  {
    id: '4',
    name: 'Anxiety Reset',
    description: 'Practice anxiety-relief rituals when triggered',
    duration: 14,
    difficulty: 'Hard',
    points: 300,
    icon: '🌊',
    color: 'from-cyan-500 to-blue-500',
    goal: 'Use quick rituals during anxiety spikes for 14 days',
    benefits: [
      'Better emotional regulation',
      'Reduced anxiety intensity',
      'Build coping toolkit'
    ]
  },
  {
    id: '5',
    name: '30-Day Ritual Lifestyle',
    description: 'Complete at least one ritual every single day',
    duration: 30,
    difficulty: 'Hard',
    points: 500,
    icon: '⚡',
    color: 'from-green-500 to-teal-500',
    goal: 'Maintain a daily ritual practice for 30 days',
    benefits: [
      'Transform rituals into lifestyle',
      'Significant mental health improvement',
      'Unlock ultimate achievement'
    ]
  }
]

export default function ChallengesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available')
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)

  const joinChallenge = (challenge: any) => {
    // In production, this would save to database
    alert(`You've joined the ${challenge.name} challenge! Go to your dashboard to start.`)
    setSelectedChallenge(null)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Ritual Challenges</h1>
        <p className="text-gray-400 text-lg">
          Join challenges to build consistency and earn rewards
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6"
        >
          <div className="text-purple-200 text-sm mb-1">Active Challenges</div>
          <div className="text-4xl font-bold text-white">0</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6"
        >
          <div className="text-green-200 text-sm mb-1">Completed</div>
          <div className="text-4xl font-bold text-white">0</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6"
        >
          <div className="text-cyan-200 text-sm mb-1">Total Points Earned</div>
          <div className="text-4xl font-bold text-white">0</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['available', 'active', 'completed'] as const).map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center text-3xl`}>
                  {challenge.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
              </div>
            </div>

            {/* Challenge details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-semibold">{challenge.duration} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Difficulty:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Reward:</span>
                <span className="text-purple-400 font-semibold">+{challenge.points} points</span>
              </div>
            </div>

            {/* Goal */}
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <div className="text-gray-400 text-xs mb-1">GOAL</div>
              <div className="text-white text-sm">{challenge.goal}</div>
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <div className="text-gray-400 text-xs mb-2">BENEFITS</div>
              <ul className="space-y-1">
                {challenge.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChallenge(challenge)}
              className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${challenge.color} text-white`}
            >
              Join Challenge
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Challenge detail modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${selectedChallenge.color} flex items-center justify-center text-4xl mb-4`}>
                {selectedChallenge.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedChallenge.name}</h2>
              <p className="text-gray-400">{selectedChallenge.duration} Day Challenge</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Ready to commit?</h3>
              <p className="text-gray-400 text-sm mb-4">
                You'll need to complete {selectedChallenge.goal.toLowerCase()} to earn {selectedChallenge.points} points.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Daily reminders</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Progress tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Achievement on completion</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => joinChallenge(selectedChallenge)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r ${selectedChallenge.color} text-white`}
              >
                Start Challenge
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChallenge(null)}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

