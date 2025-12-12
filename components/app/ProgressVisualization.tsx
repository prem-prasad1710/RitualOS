'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface Session {
  completedAt?: string | Date
  ritual?: {
    category?: string
  }
}

interface ProgressVisualizationProps {
  sessions?: Session[]
}

export default function ProgressVisualization({ sessions = [] }: ProgressVisualizationProps) {
  // Generate data for the last 7 days
  const getLast7DaysData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      const count = sessions.filter((s) => {
        if (!s.completedAt) return false
        const sessionDate = new Date(s.completedAt)
        return sessionDate.toDateString() === date.toDateString()
      }).length

      data.push({
        day: dayName,
        rituals: count,
      })
    }
    
    return data
  }

  // Get category distribution
  const getCategoryData = () => {
    const categories: Record<string, number> = {}
    
    sessions.forEach((session) => {
      const category = session.ritual?.category || 'Other'
      categories[category] = (categories[category] || 0) + 1
    })

    return Object.entries(categories).map(([name, value]) => ({
      category: name,
      count: value,
    }))
  }

  // Get wellness radar data
  const getWellnessData = () => {
    return [
      { category: 'Focus', score: Math.min(90, sessions.length * 5) },
      { category: 'Energy', score: Math.min(85, sessions.length * 4.5) },
      { category: 'Calm', score: Math.min(80, sessions.length * 4) },
      { category: 'Mindfulness', score: Math.min(88, sessions.length * 4.8) },
      { category: 'Consistency', score: Math.min(92, sessions.length * 5.2) },
    ]
  }

  const weeklyData = getLast7DaysData()
  const categoryData = getCategoryData()
  const wellnessData = getWellnessData()

  const totalRituals = sessions.length
  const thisWeekRituals = weeklyData.reduce((sum, day) => sum + day.rituals, 0)
  const avgPerDay = thisWeekRituals > 0 ? (thisWeekRituals / 7).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg"
        >
          <p className="text-purple-200 text-sm mb-1">Total Rituals</p>
          <p className="text-4xl font-bold text-white">{totalRituals}</p>
          <p className="text-purple-200 text-sm mt-1">all time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 shadow-lg"
        >
          <p className="text-cyan-200 text-sm mb-1">This Week</p>
          <p className="text-4xl font-bold text-white">{thisWeekRituals}</p>
          <p className="text-cyan-200 text-sm mt-1">rituals completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg"
        >
          <p className="text-green-200 text-sm mb-1">Daily Average</p>
          <p className="text-4xl font-bold text-white">{avgPerDay}</p>
          <p className="text-green-200 text-sm mt-1">rituals/day</p>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar
              dataKey="rituals"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={categoryData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 6 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Wellness Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Wellness Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={wellnessData}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="category" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#667eea"
                fill="url(#radarGradient)"
                fillOpacity={0.6}
                animationDuration={1500}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-purple-400 font-semibold mb-2">🎯 Most Active Day</p>
            <p className="text-gray-300 text-sm">
              {weeklyData.reduce((max, day) => day.rituals > max.rituals ? day : max, weeklyData[0]).day} - 
              Keep up the momentum!
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-cyan-400 font-semibold mb-2">📈 Growth Trend</p>
            <p className="text-gray-300 text-sm">
              {thisWeekRituals > 7 ? 'Excellent! You\'re above target.' : 'Good start! Aim for 1+ ritual daily.'}
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-green-400 font-semibold mb-2">⚡ Energy Level</p>
            <p className="text-gray-300 text-sm">
              Your consistency shows high discipline. Consider adding more challenging rituals.
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold mb-2">🎨 Next Goal</p>
            <p className="text-gray-300 text-sm">
              {totalRituals < 10 ? 'Reach 10 rituals to unlock Ritual Apprentice badge!' :
               totalRituals < 50 ? 'Complete 50 rituals for Ritual Master!' :
               'You\'re crushing it! Keep the streak alive! 🔥'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}




