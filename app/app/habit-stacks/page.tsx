'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

type Ritual = {
  id: string
  name: string
  category: string
  durationMinutes: number
}

type HabitStack = {
  id: string
  name: string
  description: string
  trigger: {
    type: 'time' | 'after_ritual' | 'location' | 'event'
    value: string
  }
  rituals: {
    id: string
    order: number
    ritual: Ritual
  }[]
  isActive: boolean
  createdAt: string
}

export default function HabitStacksPage() {
  const { user, isLoading } = useStore()
  const router = useRouter()
  const [stacks, setStacks] = useState<HabitStack[]>([])
  const [rituals, setRituals] = useState<Ritual[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newStackName, setNewStackName] = useState('')
  const [newStackDescription, setNewStackDescription] = useState('')
  const [selectedTriggerType, setSelectedTriggerType] = useState<'time' | 'after_ritual' | 'location' | 'event'>('time')
  const [triggerValue, setTriggerValue] = useState('')
  const [selectedRituals, setSelectedRituals] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const triggerTypes = [
    { value: 'time', label: 'Time of Day', icon: '⏰', example: '08:00' },
    { value: 'after_ritual', label: 'After Ritual', icon: '🔗', example: 'Select a ritual' },
    { value: 'location', label: 'Location', icon: '📍', example: 'Home, Office, Gym' },
    { value: 'event', label: 'Life Event', icon: '🎯', example: 'Wake up, Lunch, Bedtime' }
  ]

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchStacks()
      fetchRituals()
    }
  }, [user])

  const fetchStacks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/habit-stacks', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setStacks(data.stacks)
      }
    } catch (error) {
      console.error('Error fetching stacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRituals = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/rituals', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setRituals(data.rituals)
      }
    } catch (error) {
      console.error('Error fetching rituals:', error)
    }
  }

  const createStack = async () => {
    if (!newStackName.trim()) {
      setError('Stack name is required')
      return
    }

    if (!triggerValue.trim()) {
      setError('Trigger value is required')
      return
    }

    if (selectedRituals.length === 0) {
      setError('Select at least one ritual')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/habit-stacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newStackName,
          description: newStackDescription,
          trigger: {
            type: selectedTriggerType,
            value: triggerValue
          },
          ritualIds: selectedRituals
        })
      })

      if (response.ok) {
        const data = await response.json()
        setStacks([data.stack, ...stacks])
        resetForm()
        setSuccess('Habit stack created successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create habit stack')
      }
    } catch (error) {
      setError('Failed to create habit stack')
    }
  }

  const resetForm = () => {
    setNewStackName('')
    setNewStackDescription('')
    setSelectedTriggerType('time')
    setTriggerValue('')
    setSelectedRituals([])
    setShowCreateModal(false)
    setError('')
  }

  const toggleStack = async (stackId: string, currentState: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/habit-stacks/${stackId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentState })
      })

      if (response.ok) {
        setStacks(stacks.map(s => s.id === stackId ? { ...s, isActive: !currentState } : s))
        setSuccess(`Stack ${!currentState ? 'activated' : 'deactivated'}!`)
        setTimeout(() => setSuccess(''), 2000)
      }
    } catch (error) {
      setError('Failed to toggle stack')
    }
  }

  const deleteStack = async (stackId: string) => {
    if (!confirm('Are you sure you want to delete this habit stack?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/habit-stacks/${stackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setStacks(stacks.filter(s => s.id !== stackId))
        setSuccess('Stack deleted successfully')
        setTimeout(() => setSuccess(''), 2000)
      }
    } catch (error) {
      setError('Failed to delete stack')
    }
  }

  const toggleRitualSelection = (ritualId: string) => {
    setSelectedRituals(prev =>
      prev.includes(ritualId)
        ? prev.filter(id => id !== ritualId)
        : [...prev, ritualId]
    )
  }

  const getTriggerDisplay = (trigger: HabitStack['trigger']) => {
    switch (trigger.type) {
      case 'time':
        return `⏰ ${trigger.value}`
      case 'after_ritual':
        const ritual = rituals.find(r => r.id === trigger.value)
        return `🔗 After "${ritual?.name || 'Unknown'}"`
      case 'location':
        return `📍 ${trigger.value}`
      case 'event':
        return `🎯 ${trigger.value}`
      default:
        return trigger.value
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🔗 Habit Stacking
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Chain rituals together with triggers to build powerful habit sequences
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center"
            >
              {error}
              <button onClick={() => setError('')} className="ml-4 underline">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
          >
            ➕ Create Habit Stack
          </button>
        </motion.div>

        {/* Stacks Grid */}
        {stacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-2xl font-semibold mb-2">No habit stacks yet</h3>
            <p>Create your first habit stack to build powerful ritual sequences!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stacks.map((stack, index) => (
              <motion.div
                key={stack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border ${
                  stack.isActive ? 'border-green-500/50' : 'border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {stack.name}
                    </h3>
                    {stack.description && (
                      <p className="text-gray-300 text-sm mb-3">{stack.description}</p>
                    )}
                    <div className="inline-block px-3 py-1 bg-indigo-500/30 rounded-full text-indigo-300 text-sm">
                      {getTriggerDisplay(stack.trigger)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStack(stack.id, stack.isActive)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        stack.isActive
                          ? 'bg-green-500/30 text-green-300 hover:bg-green-500/40'
                          : 'bg-gray-500/30 text-gray-300 hover:bg-gray-500/40'
                      }`}
                    >
                      {stack.isActive ? '✓ Active' : '○ Inactive'}
                    </button>
                  </div>
                </div>

                {/* Ritual Chain */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-400 font-semibold mb-2">Ritual Chain:</div>
                  {stack.rituals
                    .sort((a, b) => a.order - b.order)
                    .map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <div className="text-white font-semibold">{item.ritual.name}</div>
                          <div className="text-gray-400 text-xs">
                            {item.ritual.category} • {item.ritual.durationMinutes} min
                          </div>
                        </div>
                        {idx < stack.rituals.length - 1 && (
                          <div className="text-gray-500">→</div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Total Duration */}
                <div className="text-center text-gray-400 text-sm mb-4">
                  Total Duration: {stack.rituals.reduce((sum, r) => sum + r.ritual.durationMinutes, 0)} minutes
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteStack(stack.id)}
                    className="flex-1 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-red-300 text-sm transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Stack Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => resetForm()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-indigo-500/30 my-8"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Create Habit Stack</h2>
                
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-gray-300 mb-2">Stack Name *</label>
                    <input
                      type="text"
                      value={newStackName}
                      onChange={(e) => setNewStackName(e.target.value)}
                      placeholder="Morning Routine"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description (optional)</label>
                    <textarea
                      value={newStackDescription}
                      onChange={(e) => setNewStackDescription(e.target.value)}
                      placeholder="Start my day with energy and focus"
                      rows={2}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Trigger Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {triggerTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedTriggerType(type.value as any)}
                          className={`p-3 rounded-lg border transition ${
                            selectedTriggerType === type.value
                              ? 'bg-indigo-500/30 border-indigo-500'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-white text-sm font-semibold">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Trigger Value * 
                      <span className="text-gray-500 text-sm ml-2">
                        (e.g., {triggerTypes.find(t => t.value === selectedTriggerType)?.example})
                      </span>
                    </label>
                    {selectedTriggerType === 'after_ritual' ? (
                      <select
                        value={triggerValue}
                        onChange={(e) => setTriggerValue(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Select a ritual</option>
                        {rituals.map((ritual) => (
                          <option key={ritual.id} value={ritual.id}>
                            {ritual.name} ({ritual.durationMinutes} min)
                          </option>
                        ))}
                      </select>
                    ) : selectedTriggerType === 'time' ? (
                      <input
                        type="time"
                        value={triggerValue}
                        onChange={(e) => setTriggerValue(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={triggerValue}
                        onChange={(e) => setTriggerValue(e.target.value)}
                        placeholder={triggerTypes.find(t => t.value === selectedTriggerType)?.example}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Select Rituals * (in order)</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {rituals.map((ritual) => (
                        <button
                          key={ritual.id}
                          onClick={() => toggleRitualSelection(ritual.id)}
                          className={`w-full p-3 rounded-lg border transition text-left ${
                            selectedRituals.includes(ritual.id)
                              ? 'bg-indigo-500/30 border-indigo-500'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-semibold">{ritual.name}</div>
                              <div className="text-gray-400 text-xs">
                                {ritual.category} • {ritual.durationMinutes} min
                              </div>
                            </div>
                            {selectedRituals.includes(ritual.id) && (
                              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
                                {selectedRituals.indexOf(ritual.id) + 1}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {rituals.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        No rituals found. Create some rituals first!
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createStack}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                  >
                    Create Stack
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


