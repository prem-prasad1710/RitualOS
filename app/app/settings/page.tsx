'use client'

/**
 * Settings Page
 * 
 * User profile and preferences management
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [notifications, setNotifications] = useState(true)
  const [focusGoal, setFocusGoal] = useState(user?.focusGoal || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to the database
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your RitualOS experience</p>
      </motion.div>

      <div className="max-w-2xl">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{user?.name}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Goal
              </label>
              <select
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a goal</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Startup">Startup</option>
                <option value="Health">Health</option>
                <option value="Creative">Creative Work</option>
                <option value="Personal">Personal Growth</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Theme</h3>
                <p className="text-gray-400 text-sm">Choose your preferred color scheme</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Dark
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Light
                </motion.button>
              </div>
            </div>

            {theme === 'light' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
              >
                <p className="text-blue-400 text-sm">
                  ✨ Light theme coming soon! We're currently optimized for dark mode.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Ritual Reminders</h3>
                <p className="text-gray-400 text-sm">Get reminded to complete your daily rituals</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                  animate={{ left: notifications ? '28px' : '4px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Data & Privacy</h2>

          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                <h3 className="text-green-400 font-semibold">Your data stays yours</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We don't sell your data or show tracking ads. Your rituals and reflections are private.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-left"
            >
              Export Your Data
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-left"
            >
              Delete Account
            </motion.button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </motion.button>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>RitualOS v1.0.0</p>
          <p className="mt-1">Built for focused minds in a distracted world</p>
        </motion.div>
      </div>
    </div>
  )
}

