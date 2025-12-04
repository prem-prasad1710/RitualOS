'use client'

/**
 * Ritual Marketplace
 * 
 * Browse and use community-created ritual templates
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getCategoryColor, formatDuration } from '@/lib/utils'

const templates = [
  {
    id: '1',
    name: 'The 2-Minute Power Start',
    author: 'Sarah Chen',
    authorAvatar: '👩‍💻',
    description: 'Quick morning ritual for busy professionals',
    category: 'Focus',
    duration: 2,
    uses: 1247,
    rating: 4.9,
    steps: [
      { name: 'Intention Setting', duration: 1 },
      { name: 'Energy Boost', duration: 1 }
    ]
  },
  {
    id: '2',
    name: 'Digital Sunset Protocol',
    author: 'Marcus Johnson',
    authorAvatar: '👨‍💼',
    description: 'Break the doomscroll habit before bed',
    category: 'Sleep',
    duration: 10,
    uses: 2891,
    rating: 5.0,
    steps: [
      { name: 'Phone Distance', duration: 1 },
      { name: 'Gratitude Journal', duration: 3 },
      { name: 'Tomorrow Planning', duration: 2 },
      { name: 'Body Scan', duration: 4 }
    ]
  },
  {
    id: '3',
    name: 'Anxiety SOS',
    author: 'Dr. Emily Park',
    authorAvatar: '👩‍⚕️',
    description: 'Emergency ritual for panic attacks',
    category: 'Reset',
    duration: 5,
    uses: 3456,
    rating: 4.8,
    steps: [
      { name: '5-4-3-2-1 Grounding', duration: 2 },
      { name: 'Box Breathing', duration: 3 }
    ]
  },
  {
    id: '4',
    name: 'Deep Work Activation',
    author: 'Alex Rivera',
    authorAvatar: '👨‍🎨',
    description: 'Enter flow state in 8 minutes',
    category: 'Focus',
    duration: 8,
    uses: 1876,
    rating: 4.7,
    steps: [
      { name: 'Context Clear', duration: 2 },
      { name: 'Intention Anchor', duration: 3 },
      { name: 'Energy Check', duration: 1 },
      { name: 'Timer Set', duration: 2 }
    ]
  },
  {
    id: '5',
    name: 'Social Confidence Boost',
    author: 'Nina Rodriguez',
    authorAvatar: '👩‍🦰',
    description: 'Prep for meetings and social events',
    category: 'Social',
    duration: 7,
    uses: 892,
    rating: 4.6,
    steps: [
      { name: 'Breathing Reset', duration: 3 },
      { name: 'Power Pose', duration: 2 },
      { name: 'Prepared Questions', duration: 2 }
    ]
  },
  {
    id: '6',
    name: 'Midday Energy Reset',
    author: 'Chris Taylor',
    authorAvatar: '👨‍🔬',
    description: 'Beat the afternoon slump',
    category: 'Reset',
    duration: 6,
    uses: 1543,
    rating: 4.5,
    steps: [
      { name: 'Movement Break', duration: 2 },
      { name: 'Hydration Check', duration: 1 },
      { name: 'Quick Meditation', duration: 3 }
    ]
  }
]

const categories = ['All', 'Focus', 'Reset', 'Social', 'Sleep']
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Shortest']

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const filteredTemplates = templates.filter(
    t => selectedCategory === 'All' || t.category === selectedCategory
  )

  const useTemplate = (template: any) => {
    alert(`Template "${template.name}" added to your rituals! Go to Ritual Builder to customize it.`)
    setSelectedTemplate(null)
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
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-gray-400 text-sm">Ritual Templates</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-gray-400 text-sm">Total Uses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">4.8★</div>
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
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
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
              <span className="text-gray-400 text-sm">by {template.author}</span>
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
                <span className="text-white font-semibold">{template.rating}</span>
              </div>
              <span className="text-gray-400">{template.uses.toLocaleString()} uses</span>
            </div>

            {/* Steps preview */}
            <div className="text-xs text-gray-500 mb-4">
              {template.steps.length} steps: {template.steps.map(s => s.name).join(' → ')}
            </div>

            {/* Use button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
            >
              Use Template
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Template detail modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{selectedTemplate.authorAvatar}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                  <p className="text-gray-400">by {selectedTemplate.author}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{selectedTemplate.description}</p>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(selectedTemplate.category)} text-white font-medium text-sm`}>
                  {selectedTemplate.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span>★</span>
                  <span className="text-white font-semibold">{selectedTemplate.rating}</span>
                </div>
                <span className="text-gray-400">{selectedTemplate.uses.toLocaleString()} uses</span>
              </div>
            </div>

            {/* Steps */}
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

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => useTemplate(selectedTemplate)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
              >
                Use This Template
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
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
        >
          Share Your Ritual
        </motion.button>
      </motion.div>
    </div>
  )
}

