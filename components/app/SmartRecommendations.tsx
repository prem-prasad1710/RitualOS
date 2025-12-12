'use client'

/**
 * Smart Ritual Recommendations - AI-powered suggestions
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Recommendation {
  id: string
  title: string
  description: string
  duration: number
  category: string
  reason: string
  confidence: number
  icon: string
  color: string
}

interface Props {
  currentMood?: string
  timeOfDay?: string
  recentRituals?: string[]
}

export default function SmartRecommendations({ 
  currentMood = 'neutral', 
  timeOfDay = 'morning',
  recentRituals = []
}: Props) {
  const [selectedMood, setSelectedMood] = useState(currentMood)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const moods = [
    { id: 'energized', emoji: '⚡', label: 'Energized' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'focused', emoji: '🎯', label: 'Focused' },
    { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed' },
  ]

  // Generate recommendations based on mood and time
  const recommendations = useMemo((): Recommendation[] => {
    const hour = new Date().getHours()
    const isEarlyMorning = hour >= 5 && hour < 9
    const isMorning = hour >= 9 && hour < 12
    const isAfternoon = hour >= 12 && hour < 17
    const isEvening = hour >= 17 && hour < 22
    const isNight = hour >= 22 || hour < 5

    const recs: Recommendation[] = []

    // Time-based recommendations
    if (isEarlyMorning) {
      recs.push({
        id: '1',
        title: 'Morning Energizer',
        description: '10 minutes of stretching and breathwork to wake up your body and mind',
        duration: 10,
        category: 'Focus',
        reason: 'Perfect for early morning energy boost',
        confidence: 95,
        icon: '🌅',
        color: 'from-orange-500 to-yellow-500'
      })
    }

    if (isMorning) {
      recs.push({
        id: '2',
        title: 'Deep Work Preparation',
        description: 'Get into flow state with intention setting and focus breathing',
        duration: 5,
        category: 'Focus',
        reason: 'Morning is your peak focus time',
        confidence: 90,
        icon: '🎯',
        color: 'from-purple-500 to-indigo-500'
      })
    }

    if (isAfternoon) {
      recs.push({
        id: '3',
        title: 'Midday Reset',
        description: 'Quick meditation to recharge and refocus for the afternoon',
        duration: 5,
        category: 'Reset',
        reason: 'Beat the afternoon slump',
        confidence: 85,
        icon: '🔄',
        color: 'from-cyan-500 to-blue-500'
      })
    }

    if (isEvening) {
      recs.push({
        id: '4',
        title: 'Wind Down Ritual',
        description: 'Gentle stretching and reflection to transition from work to rest',
        duration: 15,
        category: 'Reset',
        reason: 'Evening is perfect for winding down',
        confidence: 92,
        icon: '🌆',
        color: 'from-pink-500 to-rose-500'
      })
    }

    if (isNight) {
      recs.push({
        id: '5',
        title: 'Sleep Preparation',
        description: 'Calming breathwork and progressive relaxation for better sleep',
        duration: 10,
        category: 'Sleep',
        reason: 'Prepare your mind and body for rest',
        confidence: 96,
        icon: '🌙',
        color: 'from-indigo-600 to-purple-700'
      })
    }

    // Mood-based recommendations
    if (selectedMood === 'anxious') {
      recs.push({
        id: '6',
        title: '5-4-3-2-1 Grounding',
        description: 'Sensory grounding technique to calm anxiety and return to present',
        duration: 5,
        category: 'Reset',
        reason: 'Highly effective for anxiety relief',
        confidence: 93,
        icon: '🌊',
        color: 'from-teal-500 to-cyan-500'
      })
      recs.push({
        id: '7',
        title: 'Box Breathing Practice',
        description: 'Navy SEAL breathing technique for instant calm',
        duration: 3,
        category: 'Reset',
        reason: 'Proven to reduce stress quickly',
        confidence: 91,
        icon: '📦',
        color: 'from-blue-500 to-indigo-500'
      })
    }

    if (selectedMood === 'tired') {
      recs.push({
        id: '8',
        title: 'Quick Energy Boost',
        description: 'Dynamic movement and breathwork to increase alertness',
        duration: 7,
        category: 'Focus',
        reason: 'Boosts energy without caffeine',
        confidence: 87,
        icon: '⚡',
        color: 'from-yellow-500 to-orange-500'
      })
      recs.push({
        id: '9',
        title: 'Power Nap Alternative',
        description: 'Guided rest and visualization for mental refresh',
        duration: 10,
        category: 'Reset',
        reason: 'Better than scrolling when tired',
        confidence: 84,
        icon: '💤',
        color: 'from-purple-500 to-pink-500'
      })
    }

    if (selectedMood === 'overwhelmed') {
      recs.push({
        id: '10',
        title: 'Mind Dump & Prioritize',
        description: 'Write everything down, then identify the one thing that matters',
        duration: 10,
        category: 'Focus',
        reason: 'Clears mental clutter effectively',
        confidence: 89,
        icon: '📝',
        color: 'from-green-500 to-teal-500'
      })
      recs.push({
        id: '11',
        title: 'Micro-Break Series',
        description: 'Three 2-minute breaks to reset and refocus',
        duration: 6,
        category: 'Reset',
        reason: 'Prevents burnout when overwhelmed',
        confidence: 86,
        icon: '⏸️',
        color: 'from-amber-500 to-orange-500'
      })
    }

    if (selectedMood === 'focused') {
      recs.push({
        id: '12',
        title: 'Deep Work Session',
        description: 'Pomodoro technique with ambient sounds for maximum productivity',
        duration: 25,
        category: 'Focus',
        reason: 'Perfect for your current focus state',
        confidence: 94,
        icon: '🚀',
        color: 'from-purple-600 to-blue-600'
      })
    }

    // Generic always-good recommendations
    recs.push({
      id: '13',
      title: 'Gratitude Moment',
      description: 'Reflect on three things you\'re grateful for today',
      duration: 3,
      category: 'Reset',
      reason: 'Boosts mood and perspective',
      confidence: 82,
      icon: '🙏',
      color: 'from-pink-500 to-red-500'
    })

    // Sort by confidence
    return recs.sort((a, b) => b.confidence - a.confidence).slice(0, 6)
  }, [selectedMood])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Smart Recommendations</h2>
        <p className="text-gray-400">AI-powered ritual suggestions based on your current state</p>
      </div>

      {/* Mood Selector */}
      <div className="bg-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-sm mb-4">How are you feeling right now?</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedMood === mood.id
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${rec.color} p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{rec.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{rec.title}</h3>
                    <p className="text-white/80 text-sm">{rec.duration} minutes</p>
                  </div>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <p className="text-white text-xs font-semibold">
                    {rec.confidence}% match
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-3">
                {rec.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                  {rec.category}
                </span>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-3 mb-4 border border-purple-500/30">
                <p className="text-purple-300 text-xs font-medium mb-1">Why this works:</p>
                <p className="text-gray-300 text-sm">{rec.reason}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${rec.color} text-white`}
              >
                Start This Ritual
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🤖</span>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">AI Insight</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {selectedMood === 'anxious' && "Based on your state, quick grounding techniques will help you feel centered. Try the 5-4-3-2-1 method first."}
              {selectedMood === 'tired' && "Your energy is low. A 7-minute movement ritual can be more effective than another coffee."}
              {selectedMood === 'overwhelmed' && "When overwhelmed, the best strategy is to slow down and clear your mind before tackling tasks."}
              {selectedMood === 'focused' && "You're in a great mental state! Use this momentum for your most important work."}
              {selectedMood === 'calm' && "Perfect state for reflection or creative work. Consider journaling or planning."}
              {selectedMood === 'energized' && "High energy is perfect for physical rituals and challenging tasks. Channel this wisely!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

