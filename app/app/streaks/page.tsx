'use client'

/**
 * Streak Tracker Page
 */

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import StreakTracker from '@/components/app/StreakTracker'

export default function StreaksPage() {
  const { token, user } = useAuthStore()
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

  const calculateStreak = () => {
    const completed = sessions.filter(s => s.completedAt).sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    
    let streak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    for (const session of completed) {
      const sessionDate = new Date(session.completedAt)
      sessionDate.setHours(0, 0, 0, 0)
      
      const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const calculateLongestStreak = () => {
    // This is simplified - in production, you'd track this properly
    return Math.max(calculateStreak(), user?.streakCount || 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <StreakTracker 
        currentStreak={calculateStreak()}
        longestStreak={calculateLongestStreak()}
        onStreakUpdate={fetchSessions}
      />
    </div>
  )
}

