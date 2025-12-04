/**
 * RitualOS Type Definitions
 * 
 * Centralized type definitions for the entire application
 */

export type User = {
  id: string
  name: string
  email: string
  focusGoal?: string | null
  streakCount: number
  totalPoints: number
  level: number
  createdAt: Date
}

export type Ritual = {
  id: string
  userId: string
  name: string
  category: RitualCategory
  durationMinutes: number
  moodTag?: string | null
  description?: string | null
  isPublic: boolean
  isTemplate: boolean
  templateUses: number
  createdAt: Date
  updatedAt: Date
}

export type RitualCategory = 'Focus' | 'Reset' | 'Social' | 'Sleep' | 'Custom'

export type MoodTag = 'Anxious' | 'Tired' | 'Overwhelmed' | 'Energized' | 'Calm' | 'Excited'

export type RitualLoop = {
  id: string
  userId: string
  name: string
  description?: string | null
  isPublic: boolean
  isTemplate: boolean
  templateUses: number
  createdAt: Date
  updatedAt: Date
  steps?: RitualLoopStepWithRitual[]
}

export type RitualLoopStep = {
  id: string
  loopId: string
  ritualId: string
  order: number
}

export type RitualLoopStepWithRitual = RitualLoopStep & {
  ritual: Ritual
}

export type RitualSession = {
  id: string
  userId: string
  loopId?: string | null
  startedAt: Date
  completedAt?: Date | null
  selfReportedMoodBefore?: string | null
  selfReportedMoodAfter?: string | null
  pointsEarned: number
}

export type RitualReflection = {
  id: string
  sessionId: string
  question: string
  answer: string
}

export type InsightData = {
  completionRate: number
  bestTimeOfDay: string
  averageSessionDuration: number
  moodImprovement: number
  streakDays: number
}

// AI Coach Types
export type AIRitualSuggestion = {
  name: string
  steps: {
    name: string
    category: RitualCategory
    durationMinutes: number
    description: string
    benefits: string
  }[]
  reasoning: string
  scheduleSuggestion: string
}

export type AIReflectionQuestion = {
  question: string
  purpose: string
}

// NEW: Journal Entry
export type JournalEntry = {
  id: string
  userId: string
  content: string
  mood?: string | null
  energy?: number | null
  tags?: string | null
  createdAt: Date
}

// NEW: Achievement
export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  category: 'Streak' | 'Completion' | 'Social' | 'Special'
  requirement: number
  points: number
}

export type UserAchievement = {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
  achievement?: Achievement
}

// NEW: Challenge
export type Challenge = {
  id: string
  name: string
  description: string
  duration: number
  loopId?: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  startDate: Date
  endDate: Date
}

export type UserChallenge = {
  id: string
  userId: string
  challengeId: string
  startedAt: Date
  completedAt?: Date | null
  progress: number
  challenge?: Challenge
}

// NEW: Circle (Social)
export type Circle = {
  id: string
  name: string
  description?: string | null
  inviteCode: string
  createdAt: Date
  members?: CircleMember[]
}

export type CircleMember = {
  id: string
  circleId: string
  userId: string
  role: 'owner' | 'member'
  joinedAt: Date
  user?: User
}

// NEW: Chat Message
export type ChatMessage = {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// NEW: Quick Ritual
export type QuickRitual = {
  id: string
  name: string
  description: string
  category: 'Anxiety' | 'Stress' | 'Focus' | 'Energy'
  duration: number
  steps: string // JSON array
  icon: string
}
