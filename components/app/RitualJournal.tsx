'use client'

/**
 * Ritual Journal - Reflection and journaling system
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface JournalEntry {
  id: string
  date: string
  ritualName: string
  prompt: string
  response: string
  mood: string
  tags: string[]
}

const prompts = [
  "What did you notice about your mind during this ritual?",
  "How did your body feel before and after?",
  "What resistance came up, and how did you work with it?",
  "What would make tomorrow's ritual even better?",
  "What insight or realization emerged today?",
  "How did this ritual impact your day?",
  "What are you grateful for right now?",
  "What pattern are you beginning to notice?",
]

const moods = [
  { emoji: '😊', label: 'Great', color: 'from-green-500 to-emerald-500' },
  { emoji: '🙂', label: 'Good', color: 'from-blue-500 to-cyan-500' },
  { emoji: '😐', label: 'Okay', color: 'from-gray-500 to-slate-500' },
  { emoji: '😔', label: 'Low', color: 'from-orange-500 to-amber-500' },
  { emoji: '😰', label: 'Anxious', color: 'from-red-500 to-rose-500' },
]

const suggestedTags = [
  'insight', 'breakthrough', 'struggle', 'peace', 'energy', 'focus', 
  'anxiety', 'calm', 'motivated', 'tired', 'grateful', 'challenged'
]

export default function RitualJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    ritualName: '',
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
    response: '',
    mood: '',
    tags: [] as string[]
  })
  const [searchQuery, setSearchQuery] = useState('')

  const createEntry = () => {
    if (!newEntry.response || !newEntry.mood) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ritualName: newEntry.ritualName || 'General Reflection',
      prompt: newEntry.prompt,
      response: newEntry.response,
      mood: newEntry.mood,
      tags: newEntry.tags
    }

    setEntries([entry, ...entries])
    setNewEntry({
      ritualName: '',
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      response: '',
      mood: '',
      tags: []
    })
    setShowNewEntry(false)
  }

  const toggleTag = (tag: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.includes(tag)
        ? newEntry.tags.filter(t => t !== tag)
        : [...newEntry.tags, tag]
    })
  }

  const filteredEntries = entries.filter(entry =>
    entry.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.ritualName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Ritual Journal</h2>
          <p className="text-gray-400">Reflect on your practice and track insights</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewEntry(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
        >
          + New Entry
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Entries</p>
          <p className="text-3xl font-bold text-white">{entries.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold text-green-400">
            {entries.filter(e => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(e.date) >= weekAgo
            }).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Avg. Mood</p>
          <p className="text-3xl font-bold text-cyan-400">
            {entries.length > 0 
              ? moods.find(m => m.label === entries[entries.length - 1].mood)?.emoji 
              : '😊'}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Top Tag</p>
          <p className="text-lg font-bold text-orange-400">
            {entries.length > 0
              ? (() => {
                  const counts = [...entries.flatMap(e => e.tags)]
                    .reduce((acc: Record<string, number>, tag) => {
                      acc[tag] = (acc[tag] || 0) + 1
                      return acc
                    }, {})
                  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'
                })()
              : 'none'}
          </p>
        </div>
      </div>

      {/* Search */}
      {entries.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by keyword or tag..."
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Entries */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEntries.map((entry, index) => {
            const moodData = moods.find(m => m.label === entry.mood)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{entry.ritualName}</h3>
                      {moodData && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${moodData.color} text-white`}>
                          {moodData.emoji} {moodData.label}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <p className="text-purple-400 text-sm font-medium mb-2">Prompt:</p>
                  <p className="text-gray-300 italic">{entry.prompt}</p>
                </div>

                <div className="mb-4">
                  <p className="text-white whitespace-pre-wrap">{entry.response}</p>
                </div>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredEntries.length === 0 && entries.length > 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No entries match your search</p>
          </div>
        )}

        {entries.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Your Journal</h3>
            <p className="text-gray-400 mb-6">
              Reflect on your rituals and track your insights
            </p>
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full my-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">New Journal Entry</h3>

              <div className="space-y-6">
                {/* Ritual Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ritual (optional)</label>
                  <input
                    type="text"
                    value={newEntry.ritualName}
                    onChange={(e) => setNewEntry({ ...newEntry, ritualName: e.target.value })}
                    placeholder="e.g., Morning Meditation"
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Mood Selector */}
                <div>
                  <label className="block text-gray-400 text-sm mb-3">How are you feeling?</label>
                  <div className="grid grid-cols-5 gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => setNewEntry({ ...newEntry, mood: mood.label })}
                        className={`p-4 rounded-xl transition-all ${
                          newEntry.mood === mood.label
                            ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-3xl mb-1">{mood.emoji}</div>
                        <div className="text-xs font-medium">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-purple-400 text-sm font-medium mb-2">Today's Prompt:</p>
                  <p className="text-white italic">{newEntry.prompt}</p>
                  <button
                    onClick={() => setNewEntry({ 
                      ...newEntry, 
                      prompt: prompts[Math.floor(Math.random() * prompts.length)]
                    })}
                    className="mt-2 text-cyan-400 text-sm hover:text-cyan-300"
                  >
                    🔄 Get different prompt
                  </button>
                </div>

                {/* Response */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Your Reflection</label>
                  <textarea
                    value={newEntry.response}
                    onChange={(e) => setNewEntry({ ...newEntry, response: e.target.value })}
                    placeholder="Write your thoughts..."
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-gray-400 text-sm mb-3">Tags (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          newEntry.tags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createEntry}
                  disabled={!newEntry.response || !newEntry.mood}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                    newEntry.response && newEntry.mood
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Entry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewEntry(false)}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

