'use client'

/**
 * Ritual Marketplace - Fully Functional
 * 
 * Browse and use community-created ritual templates
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategoryColor, formatDuration } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface CommunityRitual {
  id: string
  name: string
  authorId: string
  author?: {
    id: string
    name: string
  }
  authorAvatar: string
  description: string
  category: string
  duration: number
  steps: any
  usesCount: number
  rating: number
  createdAt: string
}

const categories = ['All', 'Focus', 'Reset', 'Social', 'Sleep']
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'shortest', label: 'Shortest' }
]

export default function MarketplacePage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityRitual | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  
  const [rituals, setRituals] = useState<CommunityRitual[]>([])
  const [loading, setLoading] = useState(true)
  const [using, setUsing] = useState(false)

  // Share ritual form
  const [shareForm, setShareForm] = useState({
    name: '',
    description: '',
    category: 'Focus',
    duration: 5,
    steps: [{ name: '', duration: 1 }]
  })

  useEffect(() => {
    fetchRituals()
  }, [selectedCategory, sortBy])

  const fetchRituals = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      params.append('sortBy', sortBy)

      const response = await fetch(`/api/marketplace?${params.toString()}`)
      const data = await response.json()
      
      if (data.rituals) {
        setRituals(data.rituals)
      }
    } catch (error) {
      console.error('Error fetching rituals:', error)
    } finally {
      setLoading(false)
    }
  }

  const useTemplate = async (template: CommunityRitual) => {
    if (!token) {
      alert('Please log in to use templates')
      router.push('/login')
      return
    }

    setUsing(true)
    try {
      const response = await fetch('/api/marketplace/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ communityRitualId: template.id })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ "${template.name}" added to your rituals!\n\nGo to Ritual Builder to customize it or use it right away.`)
        setSelectedTemplate(null)
        fetchRituals() // Refresh to update use count
      } else {
        alert(data.error || 'Failed to use template')
      }
    } catch (error) {
      console.error('Error using template:', error)
      alert('Failed to use template')
    } finally {
      setUsing(false)
    }
  }

  const shareRitual = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      alert('Please log in to share rituals')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shareForm)
      })

      const data = await response.json()

      if (response.ok) {
        alert('🎉 Your ritual has been shared with the community!')
        setShowShareModal(false)
        setShareForm({
          name: '',
          description: '',
          category: 'Focus',
          duration: 5,
          steps: [{ name: '', duration: 1 }]
        })
        fetchRituals()
      } else {
        alert(data.error || 'Failed to share ritual')
      }
    } catch (error) {
      console.error('Error sharing ritual:', error)
      alert('Failed to share ritual')
    }
  }

  const addStep = () => {
    setShareForm({
      ...shareForm,
      steps: [...shareForm.steps, { name: '', duration: 1 }]
    })
  }

  const removeStep = (index: number) => {
    const newSteps = shareForm.steps.filter((_, i) => i !== index)
    setShareForm({ ...shareForm, steps: newSteps })
  }

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...shareForm.steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setShareForm({ ...shareForm, steps: newSteps })
  }

  if (loading && rituals.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading marketplace...</div>
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
        <h1 className="text-4xl font-bold text-white mb-2">🏪 Ritual Marketplace</h1>
        <p className="text-gray-400 text-lg">
          Discover and use rituals created by the community
        </p>
      </motion.div>

      {/* Stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30 rounded-xl p-6 mb-8"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{rituals.length}+</div>
            <div className="text-gray-400 text-sm">Ritual Templates</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {rituals.reduce((sum, r) => sum + r.usesCount, 0)}+
            </div>
            <div className="text-gray-400 text-sm">Total Uses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {rituals.length > 0 
                ? (rituals.reduce((sum, r) => sum + r.rating, 0) / rituals.length).toFixed(1)
                : '0.0'}★
            </div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Templates grid */}
      {rituals.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No rituals found. Be the first to share one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rituals.map((template, index) => {
            const steps = Array.isArray(template.steps) ? template.steps : []
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedTemplate(template)}
                className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-all border border-gray-700 hover:border-purple-500/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{template.authorAvatar}</span>
                  <span className="text-gray-400 text-sm">
                    by {template.author?.name || 'Anonymous'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(template.category)} text-white font-medium`}>
                    {template.category}
                  </span>
                  <span className="text-gray-400">{formatDuration(template.duration)}</span>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{template.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">{template.usesCount.toLocaleString()} uses</span>
                </div>

                {/* Steps preview */}
                {steps.length > 0 && (
                  <div className="text-xs text-gray-500 mb-4">
                    {steps.length} steps: {steps.map((s: any) => s.name).join(' → ')}
                  </div>
                )}

                {/* Use button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTemplate(template)
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Use Template
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Template detail modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedTemplate.authorAvatar}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                    <p className="text-gray-400">by {selectedTemplate.author?.name || 'Anonymous'}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{selectedTemplate.description}</p>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(selectedTemplate.category)} text-white font-medium text-sm`}>
                    {selectedTemplate.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span>★</span>
                    <span className="text-white font-semibold">{selectedTemplate.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">{selectedTemplate.usesCount.toLocaleString()} uses</span>
                </div>
              </div>

              {/* Steps */}
              {Array.isArray(selectedTemplate.steps) && selectedTemplate.steps.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Ritual Steps</h3>
                  <div className="space-y-3">
                    {selectedTemplate.steps.map((step: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">{step.name}</div>
                          <div className="text-gray-400 text-sm">{step.duration} min</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-purple-400 font-semibold">
                      Total: {formatDuration(selectedTemplate.duration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => useTemplate(selectedTemplate)}
                  disabled={using}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {using ? 'Adding...' : 'Use This Template'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(null)}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share your ritual CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Have a ritual that works?</h2>
        <p className="text-gray-400 mb-6">
          Share it with the community and help others find their flow
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShareModal(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
        >
          Share Your Ritual
        </motion.button>
      </motion.div>

      {/* Share ritual modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Share Your Ritual</h2>
              
              <form onSubmit={shareRitual} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Ritual Name *</label>
                  <input
                    type="text"
                    value={shareForm.name}
                    onChange={(e) => setShareForm({ ...shareForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={shareForm.description}
                    onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Category *</label>
                    <select
                      value={shareForm.category}
                      onChange={(e) => setShareForm({ ...shareForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Focus">Focus</option>
                      <option value="Reset">Reset</option>
                      <option value="Social">Social</option>
                      <option value="Sleep">Sleep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Total Duration (min) *</label>
                    <input
                      type="number"
                      value={shareForm.duration}
                      onChange={(e) => setShareForm({ ...shareForm, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Steps *</label>
                  {shareForm.steps.map((step, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Step name"
                        value={step.name}
                        onChange={(e) => updateStep(index, 'name', e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Min"
                        value={step.duration}
                        onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value))}
                        className="w-20 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min={1}
                        required
                      />
                      {shareForm.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="mt-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
                  >
                    Share Ritual
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowShareModal(false)}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
