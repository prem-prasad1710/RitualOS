'use client'

/**
 * Insights Dashboard
 * 
 * Visualize ritual patterns and AI-generated insights
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

export default function InsightsPage() {
  const token = useAuthStore((state) => state.token)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchSessions()
    }
  }, [token])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400 text-xl">Loading insights...</div>
      </div>
    )
  }

  // Process data for charts
  const completedSessions = sessions.filter(s => s.completedAt)
  
  // Last 7 days completion data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const count = completedSessions.filter(s => {
      const sessionDate = new Date(s.completedAt)
      return sessionDate.toDateString() === date.toDateString()
    }).length
    
    return { day: dayName, rituals: count }
  })

  // Time of day distribution
  const timeOfDayData = [
    { time: 'Morning', count: 0, range: '6-12' },
    { time: 'Afternoon', count: 0, range: '12-18' },
    { time: 'Evening', count: 0, range: '18-22' },
    { time: 'Night', count: 0, range: '22-6' },
  ]

  completedSessions.forEach(session => {
    const hour = new Date(session.completedAt).getHours()
    if (hour >= 6 && hour < 12) timeOfDayData[0].count++
    else if (hour >= 12 && hour < 18) timeOfDayData[1].count++
    else if (hour >= 18 && hour < 22) timeOfDayData[2].count++
    else timeOfDayData[3].count++
  })

  // Calculate stats
  const totalCompleted = completedSessions.length
  const bestTimeOfDay = timeOfDayData.reduce((max, curr) => curr.count > max.count ? curr : max, timeOfDayData[0])
  const avgMoodImprovement = completedSessions
    .filter(s => s.selfReportedMoodBefore && s.selfReportedMoodAfter)
    .reduce((acc, s) => acc + (parseInt(s.selfReportedMoodAfter) - parseInt(s.selfReportedMoodBefore)), 0) / (completedSessions.length || 1)

  // AI-generated insights (mock data - in real app, this would call the AI client)
  const insights = [
    {
      icon: '🎯',
      title: 'Peak Performance Pattern',
      insight: bestTimeOfDay.count > 0 
        ? `You complete most rituals in the ${bestTimeOfDay.time.toLowerCase()}. Your focus seems strongest during ${bestTimeOfDay.range} hours.`
        : 'Complete a few more rituals to discover your peak performance time.',
      color: 'from-purple-600 to-purple-700',
    },
    {
      icon: '📈',
      title: 'Mood Shift Impact',
      insight: avgMoodImprovement > 0
        ? `On average, you feel ${avgMoodImprovement.toFixed(1)} points more grounded after completing rituals. The practice is working!`
        : avgMoodImprovement < 0
        ? 'Your rituals might need adjustment. Try shorter, more focused sessions.'
        : 'Start tracking your mood before and after rituals to see the impact.',
      color: 'from-cyan-600 to-cyan-700',
    },
    {
      icon: '🔄',
      title: 'Consistency Insight',
      insight: totalCompleted > 7
        ? `You've completed ${totalCompleted} rituals! You're building a sustainable practice.`
        : 'Aim for at least one ritual per day to build the habit.',
      color: 'from-green-600 to-green-700',
    },
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Insights & Patterns</h1>
        <p className="text-gray-400">Discover what works for you</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6"
        >
          <div className="text-purple-200 text-sm mb-1">Total Rituals Completed</div>
          <div className="text-4xl font-bold text-white">{totalCompleted}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6"
        >
          <div className="text-cyan-200 text-sm mb-1">Best Time of Day</div>
          <div className="text-4xl font-bold text-white">{bestTimeOfDay.time}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6"
        >
          <div className="text-green-200 text-sm mb-1">Avg Mood Improvement</div>
          <div className="text-4xl font-bold text-white">
            {avgMoodImprovement > 0 ? '+' : ''}{avgMoodImprovement.toFixed(1)}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">AI-Generated Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`bg-gradient-to-br ${insight.color} rounded-xl p-6`}
            >
              <div className="text-4xl mb-3">{insight.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{insight.title}</h3>
              <p className="text-white/90 text-sm">{insight.insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 7 Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="rituals"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time of Day Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Time of Day Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={timeOfDayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => entry.count > 0 ? `${entry.time}: ${entry.count}` : ''}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {timeOfDayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Completion Rate by Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-xl p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-white mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="rituals" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Empty State */}
      {totalCompleted === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Data Yet</h3>
          <p className="text-gray-400 mb-6">
            Complete your first ritual to start seeing insights and patterns
          </p>
          <a href="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold"
            >
              Start a Ritual
            </motion.button>
          </a>
        </motion.div>
      )}
    </div>
  )
}

