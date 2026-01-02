'use client'

/**
 * Analytics Dashboard - Deep insights into ritual patterns
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Session {
  completedAt: string
  pointsEarned: number
  selfReportedMoodBefore?: string
  selfReportedMoodAfter?: string
}

interface Props {
  sessions: Session[]
}

export default function AnalyticsDashboard({ sessions }: Props) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')

  // Filter sessions based on time range
  const filteredSessions = useMemo(() => {
    if (timeRange === 'all') return sessions
    
    const now = new Date()
    const daysAgo = timeRange === '7d' ? 7 : 30
    const cutoff = new Date(now.setDate(now.getDate() - daysAgo))
    
    return sessions.filter(s => s.completedAt && new Date(s.completedAt) >= cutoff)
  }, [sessions, timeRange])

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = filteredSessions.length
    const totalPoints = filteredSessions.reduce((sum, s) => sum + (s.pointsEarned || 0), 0)
    
    // Best day of week
    const dayCount: Record<string, number> = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    filteredSessions.forEach(s => {
      if (s.completedAt) {
        const day = days[new Date(s.completedAt).getDay()]
        dayCount[day] = (dayCount[day] || 0) + 1
      }
    })
    
    const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]
    
    // Best time of day
    const hourCount: Record<string, number> = {}
    
    filteredSessions.forEach(s => {
      if (s.completedAt) {
        const hour = new Date(s.completedAt).getHours()
        const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
        hourCount[timeSlot] = (hourCount[timeSlot] || 0) + 1
      }
    })
    
    const bestTime = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]
    
    // Weekly pattern (last 7 days)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = filteredSessions.filter(s => 
        s.completedAt && s.completedAt.startsWith(dateStr)
      ).length
      last7Days.push({ date: dateStr, count })
    }
    
    // Mood improvement
    const moodImprovement = filteredSessions.filter(s => 
      s.selfReportedMoodBefore && s.selfReportedMoodAfter &&
      parseInt(s.selfReportedMoodAfter) > parseInt(s.selfReportedMoodBefore)
    ).length
    
    const moodImprovementRate = total > 0 ? Math.round((moodImprovement / total) * 100) : 0
    
    // Average per day
    const avgPerDay = last7Days.reduce((sum, d) => sum + d.count, 0) / 7
    
    return {
      total,
      totalPoints,
      bestDay: bestDay ? bestDay[0] : 'N/A',
      bestTime: bestTime ? bestTime[0] : 'N/A',
      last7Days,
      moodImprovementRate,
      avgPerDay: avgPerDay.toFixed(1)
    }
  }, [filteredSessions])

  const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400">Deep insights into your ritual patterns</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6"
        >
          <p className="text-purple-200 text-sm mb-2">Total Rituals</p>
          <p className="text-4xl font-bold text-white mb-1">{analytics.total}</p>
          <p className="text-purple-200 text-xs">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6"
        >
          <p className="text-cyan-200 text-sm mb-2">Total Points</p>
          <p className="text-4xl font-bold text-white mb-1">{analytics.totalPoints}</p>
          <p className="text-cyan-200 text-xs">Earned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6"
        >
          <p className="text-green-200 text-sm mb-2">Best Day</p>
          <p className="text-2xl font-bold text-white mb-1">{analytics.bestDay}</p>
          <p className="text-green-200 text-xs">Most productive</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6"
        >
          <p className="text-orange-200 text-sm mb-2">Best Time</p>
          <p className="text-2xl font-bold text-white mb-1">{analytics.bestTime}</p>
          <p className="text-orange-200 text-xs">Peak performance</p>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
        <div className="space-y-3">
          {analytics.last7Days.map((day, index) => {
            const date = new Date(day.date)
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
            const percentage = (day.count / maxCount) * 100
            
            return (
              <div key={day.date} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 w-16">{dayName}</span>
                  <span className="text-gray-500 text-xs">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-white font-semibold w-12 text-right">{day.count}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Improvement */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Mood Improvement</h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90" width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#moodGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 70 * (1 - analytics.moodImprovementRate / 100)
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-white">{analytics.moodImprovementRate}%</p>
                <p className="text-gray-400 text-sm">Improved</p>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            Rituals that improved your mood
          </p>
        </div>

        {/* Average Per Day */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Daily Average</h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <motion.p 
                className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                {analytics.avgPerDay}
              </motion.p>
              <p className="text-gray-400 text-sm">Rituals per day</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            Based on last 7 days of activity
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">💡 Insights</h3>
        <div className="space-y-3">
          {analytics.total > 0 ? (
            <>
              <p className="text-gray-300">
                🎯 You're most consistent on <span className="text-purple-400 font-semibold">{analytics.bestDay}s</span>
              </p>
              <p className="text-gray-300">
                ⏰ Your peak performance time is in the <span className="text-cyan-400 font-semibold">{analytics.bestTime}</span>
              </p>
              {analytics.moodImprovementRate > 70 && (
                <p className="text-gray-300">
                  🌟 Amazing! Your rituals improve your mood <span className="text-green-400 font-semibold">{analytics.moodImprovementRate}%</span> of the time
                </p>
              )}
              {parseFloat(analytics.avgPerDay) >= 2 && (
                <p className="text-gray-300">
                  🔥 You're on fire! Averaging <span className="text-orange-400 font-semibold">{analytics.avgPerDay}</span> rituals daily
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400 italic">Complete more rituals to see personalized insights!</p>
          )}
        </div>
      </div>
    </div>
  )
}





