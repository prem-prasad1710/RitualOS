'use client'

/**
 * Daily Ritual Planner - Schedule rituals throughout the day
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScheduledRitual {
  id: string
  ritualName: string
  time: string
  completed: boolean
  category: string
}

export default function RitualPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [scheduledRituals, setScheduledRituals] = useState<ScheduledRitual[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRitual, setNewRitual] = useState({ ritualName: '', time: '09:00', category: 'Focus' })

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  const categories = ['Focus', 'Reset', 'Social', 'Sleep', 'Custom']
  const categoryColors: Record<string, string> = {
    Focus: 'from-purple-500 to-blue-500',
    Reset: 'from-green-500 to-teal-500',
    Social: 'from-pink-500 to-rose-500',
    Sleep: 'from-indigo-500 to-purple-500',
    Custom: 'from-orange-500 to-yellow-500'
  }

  const addScheduledRitual = () => {
    if (!newRitual.ritualName || !newRitual.time) return

    const ritual: ScheduledRitual = {
      id: Date.now().toString(),
      ritualName: newRitual.ritualName,
      time: newRitual.time,
      completed: false,
      category: newRitual.category
    }

    setScheduledRituals([...scheduledRituals, ritual].sort((a, b) => a.time.localeCompare(b.time)))
    setNewRitual({ ritualName: '', time: '09:00', category: 'Focus' })
    setShowAddModal(false)
  }

  const toggleComplete = (id: string) => {
    setScheduledRituals(scheduledRituals.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ))
  }

  const deleteRitual = (id: string) => {
    setScheduledRituals(scheduledRituals.filter(r => r.id !== id))
  }

  const getCurrentTimeSlot = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:00`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Daily Ritual Planner</h2>
          <p className="text-gray-400">Schedule your rituals throughout the day</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
        >
          + Add Ritual
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Scheduled Today</p>
          <p className="text-3xl font-bold text-white">{scheduledRituals.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">
            {scheduledRituals.filter(r => r.completed).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-cyan-400">
            {scheduledRituals.length > 0 
              ? Math.round((scheduledRituals.filter(r => r.completed).length / scheduledRituals.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Today's Timeline</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {timeSlots.map((timeSlot) => {
            const ritualsAtTime = scheduledRituals.filter(r => r.time === timeSlot)
            const isCurrent = timeSlot === getCurrentTimeSlot()

            return (
              <div 
                key={timeSlot}
                className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
                  isCurrent ? 'bg-purple-900/30 border border-purple-500/50' : 'hover:bg-gray-700/50'
                }`}
              >
                <div className={`w-20 flex-shrink-0 ${isCurrent ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>
                  {timeSlot}
                </div>
                <div className="flex-1 space-y-2">
                  {ritualsAtTime.length > 0 ? (
                    ritualsAtTime.map((ritual) => (
                      <motion.div
                        key={ritual.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg bg-gradient-to-r ${categoryColors[ritual.category]} ${
                          ritual.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleComplete(ritual.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                ritual.completed 
                                  ? 'bg-white border-white' 
                                  : 'border-white/50 hover:border-white'
                              }`}
                            >
                              {ritual.completed && <span className="text-purple-600 font-bold">✓</span>}
                            </button>
                            <div>
                              <p className={`text-white font-semibold ${ritual.completed ? 'line-through' : ''}`}>
                                {ritual.ritualName}
                              </p>
                              <p className="text-white/70 text-sm">{ritual.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteRitual(ritual.id)}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                          >
                            <span className="text-white">✕</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-sm italic py-2">No rituals scheduled</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Ritual Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Schedule a Ritual</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ritual Name</label>
                  <input
                    type="text"
                    value={newRitual.ritualName}
                    onChange={(e) => setNewRitual({ ...newRitual, ritualName: e.target.value })}
                    placeholder="e.g., Morning Meditation"
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Time</label>
                  <input
                    type="time"
                    value={newRitual.time}
                    onChange={(e) => setNewRitual({ ...newRitual, time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setNewRitual({ ...newRitual, category })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          newRitual.category === category
                            ? `bg-gradient-to-r ${categoryColors[category]} text-white`
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addScheduledRitual}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
                >
                  Add to Schedule
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
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





