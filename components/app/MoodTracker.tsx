'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Mood {
  id: string
  emoji: string
  label: string
  color: string
  gradient: string
}

const moods: Mood[] = [
  { id: 'amazing', emoji: '🤩', label: 'Amazing', color: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'text-green-400', gradient: 'from-green-400 to-teal-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'text-blue-400', gradient: 'from-blue-400 to-cyan-400' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-400', gradient: 'from-gray-400 to-gray-500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'text-orange-400', gradient: 'from-orange-400 to-red-400' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-600', gradient: 'from-blue-600 to-purple-600' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-400', gradient: 'from-red-400 to-pink-400' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'text-purple-400', gradient: 'from-purple-400 to-indigo-400' },
]

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: Mood; timestamp: Date; note?: string }>>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood.id)
  }

  const handleSave = () => {
    if (!selectedMood) return
    
    const mood = moods.find(m => m.id === selectedMood)
    if (!mood) return

    setMoodHistory([{ mood, timestamp: new Date(), note }, ...moodHistory])
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedMood(null)
      setNote('')
    }, 2000)
  }

  const selectedMoodData = moods.find(m => m.id === selectedMood)

  return (
    <div className="space-y-6">
      {/* Mood selector */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">How are you feeling?</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood)}
              className={`relative p-4 rounded-xl transition-all ${
                selectedMood === mood.id
                  ? `bg-gradient-to-br ${mood.gradient} shadow-lg`
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <motion.div
                animate={selectedMood === mood.id ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-2"
              >
                {mood.emoji}
              </motion.div>
              <p className={`text-sm font-medium ${selectedMood === mood.id ? 'text-white' : 'text-gray-300'}`}>
                {mood.label}
              </p>
              
              {selectedMood === mood.id && (
                <motion.div
                  layoutId="mood-selector"
                  className="absolute inset-0 border-4 border-white rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Note input */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  What's on your mind? (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe what you're feeling..."
                  className="w-full h-24 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`w-full px-6 py-3 bg-gradient-to-r ${selectedMoodData?.gradient} text-white font-semibold rounded-lg shadow-lg`}
              >
                Save Mood
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-600 text-white px-6 py-4 rounded-xl text-center font-semibold"
          >
            ✨ Mood tracked successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood history */}
      {moodHistory.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Moods</h3>
          <div className="space-y-3">
            {moodHistory.slice(0, 5).map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg"
              >
                <span className="text-3xl">{entry.mood.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${entry.mood.color}`}>
                      {entry.mood.label}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-gray-300 text-sm">{entry.note}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mood insights */}
      {moodHistory.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-2xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-2">💡 Mood Insight</h4>
          <p className="text-gray-300 text-sm">
            You've logged {moodHistory.length} moods today. Great job staying aware of your emotions! 
            {moodHistory.slice(0, 3).every(e => ['amazing', 'happy', 'calm'].includes(e.mood.id)) 
              ? " You're on a positive streak! 🌟"
              : " Remember, all emotions are valid. Consider a breathing exercise or quick ritual if you need support."}
          </p>
        </motion.div>
      )}
    </div>
  )
}




