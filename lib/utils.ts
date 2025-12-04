/**
 * General Utility Functions
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }
  
  return date.toLocaleDateString()
}

/**
 * Get time of day greeting
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Calculate streak days from sessions
 */
export function calculateStreak(sessions: { completedAt: Date | null }[]): number {
  const completedSessions = sessions
    .filter(s => s.completedAt)
    .map(s => new Date(s.completedAt!))
    .sort((a, b) => b.getTime() - a.getTime())
  
  if (completedSessions.length === 0) return 0
  
  let streak = 1
  let currentDate = new Date(completedSessions[0])
  currentDate.setHours(0, 0, 0, 0)
  
  for (let i = 1; i < completedSessions.length; i++) {
    const sessionDate = new Date(completedSessions[i])
    sessionDate.setHours(0, 0, 0, 0)
    
    const diffInDays = Math.floor(
      (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (diffInDays === 1) {
      streak++
      currentDate = sessionDate
    } else if (diffInDays > 1) {
      break
    }
  }
  
  return streak
}

/**
 * Get category color for UI
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Focus: 'from-blue-500 to-cyan-500',
    Reset: 'from-green-500 to-emerald-500',
    Social: 'from-purple-500 to-pink-500',
    Sleep: 'from-indigo-500 to-purple-500',
    Custom: 'from-orange-500 to-red-500'
  }
  
  return colors[category] || colors.Custom
}

/**
 * Get mood emoji
 */
export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    Anxious: '😰',
    Tired: '😴',
    Overwhelmed: '😵',
    Energized: '⚡',
    Calm: '😌',
    Excited: '🤩',
    Focused: '🎯',
    Scattered: '🌪️'
  }
  
  return emojis[mood] || '😊'
}

