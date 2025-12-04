'use client'

/**
 * Ritual Builder Page
 * 
 * Create and manage micro-rituals with live preview
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import { getCategoryColor, getMoodEmoji, formatDuration } from '@/lib/utils'
import { RitualCategory, MoodTag } from '@/types'

const categories: RitualCategory[] = ['Focus', 'Reset', 'Social', 'Sleep', 'Custom']
const moodTags: MoodTag[] = ['Anxious', 'Tired', 'Overwhelmed', 'Energized', 'Calm', 'Excited']

export default function RitualsPage() {
  const token = useAuthStore((state) => state.token)
  const [rituals, setRituals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Focus' as RitualCategory,
    durationMinutes: 5,
    moodTag: '' as MoodTag | '',
    description: ''
  })

  useEffect(() => {
    if (token) {
      fetchRituals()
    }
  }, [token])

  const fetchRituals = async () => {
    try {
      const response = await fetch('/api/rituals', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setRituals(data.rituals || [])
    } catch (error) {
      console.error('Failed to fetch rituals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/rituals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          category: 'Focus',
          durationMinutes: 5,
          moodTag: '',
          description: ''
        })
        // Refresh rituals
        fetchRituals()
      }
    } catch (error) {
      console.error('Failed to create ritual:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400 text-xl">Loading rituals...</div>
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
        <h1 className="text-4xl font-bold text-white mb-2">Ritual Builder</h1>
        <p className="text-gray-400">Create micro-rituals that work for your life</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create New Ritual</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ritual Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Breathing Exercise"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      formData.category === cat
                        ? 'bg-gradient-to-r ' + getCategoryColor(cat) + ' text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration: {formData.durationMinutes} minutes
              </label>
              <input
                type="range"
                min="2"
                max="30"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 min</span>
                <span>30 min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mood Tag (optional)
              </label>
              <select
                value={formData.moodTag}
                onChange={(e) => setFormData({ ...formData, moodTag: e.target.value as MoodTag | '' })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a mood</option>
                {moodTags.map((mood) => (
                  <option key={mood} value={mood}>
                    {getMoodEmoji(mood)} {mood}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this ritual involve?"
                rows={3}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              type="submit"
              disabled={creating || !formData.name}
              whileHover={{ scale: creating ? 1 : 1.02 }}
              whileTap={{ scale: creating ? 1 : 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Ritual'}
            </motion.button>
          </form>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Preview Card */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Live Preview</h2>
            
            <motion.div
              key={formData.name + formData.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${getCategoryColor(formData.category)} rounded-xl p-6 text-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {formData.name || 'Ritual Name'}
                  </h3>
                  <p className="text-sm opacity-90">{formData.category}</p>
                </div>
                {formData.moodTag && (
                  <span className="text-3xl">{getMoodEmoji(formData.moodTag)}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm opacity-90 mb-3">
                <span>⏱️</span>
                <span>{formatDuration(formData.durationMinutes)}</span>
              </div>

              {formData.description && (
                <p className="text-sm opacity-90">{formData.description}</p>
              )}
            </motion.div>
          </div>

          {/* Your Rituals */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Rituals ({rituals.length})</h2>
            
            {rituals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No rituals yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rituals.map((ritual) => (
                  <motion.div
                    key={ritual.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 4 }}
                    className="p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{ritual.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className={`px-2 py-0.5 rounded text-xs bg-gradient-to-r ${getCategoryColor(ritual.category)}`}>
                            {ritual.category}
                          </span>
                          <span>{formatDuration(ritual.durationMinutes)}</span>
                        </div>
                      </div>
                      {ritual.moodTag && (
                        <span className="text-2xl">{getMoodEmoji(ritual.moodTag)}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

