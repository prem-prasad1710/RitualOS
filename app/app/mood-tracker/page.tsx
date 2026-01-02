'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type MoodEntry = {
  id: string
  mood: string
  energy: number
  note: string
  createdAt: string
}

const moods = [
  { name: 'Excited', emoji: '🤩', value: 5, color: '#F59E0B' },
  { name: 'Happy', emoji: '😊', value: 4, color: '#10B981' },
  { name: 'Neutral', emoji: '😐', value: 3, color: '#6B7280' },
  { name: 'Sad', emoji: '😢', value: 2, color: '#3B82F6' },
  { name: 'Anxious', emoji: '😰', value: 1, color: '#EF4444' }
]

export default function MoodTrackerPage() {
  const { user, isLoading } = useStore()
  const router = useRouter()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [energy, setEnergy] = useState<number>(3)
  const [note, setNote] = useState('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchMoodEntries()
    }
  }, [user])

  const fetchMoodEntries = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/mood', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setMoodEntries(data.entries)
      }
    } catch (error) {
      console.error('Error fetching mood entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitMood = async () => {
    if (!selectedMood) {
      alert('Please select a mood')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood: selectedMood, energy, note })
      })

      if (response.ok) {
        const data = await response.json()
        setMoodEntries([data.entry, ...moodEntries])
        setSelectedMood('')
        setEnergy(3)
        setNote('')
        setSuccess('Mood logged successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('Error submitting mood:', error)
    }
  }

  const getFilteredEntries = () => {
    const now = new Date()
    let cutoff = new Date()

    switch (timeRange) {
      case '7d':
        cutoff.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoff.setDate(now.getDate() - 30)
        break
      case 'all':
        return moodEntries
    }

    return moodEntries.filter(e => new Date(e.createdAt) >= cutoff)
  }

  const getChartData = () => {
    const filtered = getFilteredEntries()
    
    return filtered.map(entry => {
      const mood = moods.find(m => m.name === entry.mood)
      return {
        date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: mood?.value || 3,
        energy: entry.energy,
        moodName: entry.mood
      }
    }).reverse()
  }

  const getMoodDistribution = () => {
    const filtered = getFilteredEntries()
    const distribution = moods.map(mood => ({
      name: mood.name,
      emoji: mood.emoji,
      count: filtered.filter(e => e.mood === mood.name).length,
      color: mood.color
    }))
    return distribution.filter(d => d.count > 0)
  }

  const getAverageMood = () => {
    const filtered = getFilteredEntries()
    if (filtered.length === 0) return 0
    
    const sum = filtered.reduce((acc, entry) => {
      const mood = moods.find(m => m.name === entry.mood)
      return acc + (mood?.value || 3)
    }, 0)
    
    return (sum / filtered.length).toFixed(1)
  }

  const getAverageEnergy = () => {
    const filtered = getFilteredEntries()
    if (filtered.length === 0) return 0
    
    const sum = filtered.reduce((acc, entry) => acc + entry.energy, 0)
    return (sum / filtered.length).toFixed(1)
  }

  const getMoodStreak = () => {
    if (moodEntries.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < moodEntries.length; i++) {
      const entryDate = new Date(moodEntries[i].createdAt)
      entryDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - streak)
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
      } else if (entryDate.getTime() < expectedDate.getTime()) {
        break
      }
    }
    
    return streak
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const chartData = getChartData()
  const moodDistribution = getMoodDistribution()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            😊 Mood Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            Track your emotional patterns and discover insights
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center"
          >
            {success}
          </motion.div>
        )}

        {/* Log Mood Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How are you feeling?</h2>
          
          {/* Mood Selection */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {moods.map((mood) => (
              <motion.button
                key={mood.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood.name)}
                className={`flex flex-col items-center p-4 rounded-xl transition ${
                  selectedMood === mood.name
                    ? 'bg-white/20 ring-2 ring-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-5xl mb-2">{mood.emoji}</div>
                <div className="text-white font-semibold text-sm">{mood.name}</div>
              </motion.button>
            ))}
          </div>

          {/* Energy Level */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Energy Level: {energy}/5</label>
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-gray-400 text-xs mt-2">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={submitMood}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Log Mood
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-bold text-blue-400">{getAverageMood()}</div>
            <div className="text-gray-300 text-sm">Avg Mood</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-bold text-green-400">{getAverageEnergy()}</div>
            <div className="text-gray-300 text-sm">Avg Energy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-bold text-orange-400">{getMoodStreak()}</div>
            <div className="text-gray-300 text-sm">Day Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-bold text-purple-400">{moodEntries.length}</div>
            <div className="text-gray-300 text-sm">Total Logs</div>
          </div>
        </motion.div>

        {/* Time Range Filter */}
        <div className="flex justify-center gap-3 mb-8">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                timeRange === range
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Charts */}
        {chartData.length > 0 ? (
          <>
            {/* Mood Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Mood Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[1, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMood)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Energy Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Energy Levels</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[1, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="energy" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Mood Distribution */}
            {moodDistribution.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Mood Distribution</h3>
                <div className="space-y-4">
                  {moodDistribution.map((mood) => (
                    <div key={mood.name} className="flex items-center gap-4">
                      <div className="text-3xl">{mood.emoji}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-white font-semibold">{mood.name}</span>
                          <span className="text-gray-400">{mood.count} times</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(mood.count / getFilteredEntries().length) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full"
                            style={{ backgroundColor: mood.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            <div className="text-6xl mb-4">😊</div>
            <h3 className="text-2xl font-semibold mb-2">No mood entries yet</h3>
            <p>Start logging your moods to see patterns and insights</p>
          </motion.div>
        )}

        {/* Recent Entries */}
        {moodEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Recent Entries</h3>
            <div className="space-y-4">
              {moodEntries.slice(0, 10).map((entry) => {
                const mood = moods.find(m => m.name === entry.mood)
                return (
                  <div key={entry.id} className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                    <div className="text-4xl">{mood?.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-semibold">{entry.mood}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">Energy: {entry.energy}/5</div>
                      {entry.note && <div className="text-gray-400 text-sm mt-2">{entry.note}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}


