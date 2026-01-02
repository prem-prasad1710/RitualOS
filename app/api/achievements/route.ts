import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/achievements
 * Get all achievements with user's unlock status and progress
 */
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create all achievements
    const allAchievements = await ensureAchievementsExist()

    // Get user's unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: payload.userId },
      include: { achievement: true }
    })

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId))

    // Get user stats for progress calculation
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        sessions: true,
        challenges: true,
        circleMembers: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate progress for each achievement
    const achievementsWithProgress = allAchievements.map(achievement => {
      const unlocked = unlockedIds.has(achievement.id)
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id)
      
      let progress = 0
      
      if (!unlocked) {
        // Calculate progress based on achievement category
        switch (achievement.category) {
          case 'Streak':
            progress = user.streakCount
            break
          case 'Completion':
            progress = user.sessions.filter(s => s.completedAt !== null).length
            break
          case 'Social':
            progress = user.circleMembers.length
            break
          case 'Special':
            // Special achievements might have different criteria
            progress = 0
            break
        }
      }

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        requirement: achievement.requirement,
        points: achievement.points,
        unlocked,
        unlockedAt: userAchievement?.unlockedAt?.toISOString(),
        progress: !unlocked ? progress : undefined
      }
    })

    // Sort: unlocked first, then by category
    achievementsWithProgress.sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
      return a.category.localeCompare(b.category)
    })

    return NextResponse.json({ achievements: achievementsWithProgress })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

/**
 * Ensure all achievements exist in the database
 */
async function ensureAchievementsExist() {
  const defaultAchievements = [
    // Streak Achievements
    {
      name: 'First Steps',
      description: 'Complete your first ritual',
      icon: '🌱',
      category: 'Streak',
      requirement: 1,
      points: 10
    },
    {
      name: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      category: 'Streak',
      requirement: 3,
      points: 50
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      category: 'Streak',
      requirement: 7,
      points: 100
    },
    {
      name: 'Habit Master',
      description: 'Maintain a 21-day streak',
      icon: '🎯',
      category: 'Streak',
      requirement: 21,
      points: 300
    },
    {
      name: 'Month Legend',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      category: 'Streak',
      requirement: 30,
      points: 500
    },
    {
      name: 'Centurion',
      description: 'Maintain a 100-day streak',
      icon: '🏆',
      category: 'Streak',
      requirement: 100,
      points: 1500
    },
    
    // Completion Achievements
    {
      name: 'Ritual Rookie',
      description: 'Complete 5 rituals',
      icon: '✨',
      category: 'Completion',
      requirement: 5,
      points: 25
    },
    {
      name: 'Ritual Regular',
      description: 'Complete 25 rituals',
      icon: '🌟',
      category: 'Completion',
      requirement: 25,
      points: 100
    },
    {
      name: 'Ritual Expert',
      description: 'Complete 50 rituals',
      icon: '💫',
      category: 'Completion',
      requirement: 50,
      points: 250
    },
    {
      name: 'Ritual Master',
      description: 'Complete 100 rituals',
      icon: '🌠',
      category: 'Completion',
      requirement: 100,
      points: 500
    },
    
    // Social Achievements
    {
      name: 'Social Butterfly',
      description: 'Join your first accountability circle',
      icon: '🤝',
      category: 'Social',
      requirement: 1,
      points: 50
    },
    {
      name: 'Circle Leader',
      description: 'Create an accountability circle',
      icon: '👥',
      category: 'Social',
      requirement: 1,
      points: 75
    },
    {
      name: 'Community Champion',
      description: 'Join 3 accountability circles',
      icon: '🌐',
      category: 'Social',
      requirement: 3,
      points: 150
    },
    
    // Special Achievements
    {
      name: 'Night Owl',
      description: 'Complete a ritual after midnight',
      icon: '🦉',
      category: 'Special',
      requirement: 1,
      points: 25
    },
    {
      name: 'Early Bird',
      description: 'Complete a ritual before 6 AM',
      icon: '🐦',
      category: 'Special',
      requirement: 1,
      points: 25
    },
    {
      name: 'Weekend Warrior',
      description: 'Complete rituals on both Saturday and Sunday',
      icon: '🎮',
      category: 'Special',
      requirement: 1,
      points: 50
    }
  ]

  // Create achievements that don't exist yet
  for (const achievement of defaultAchievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement
    })
  }

  return prisma.achievement.findMany()
}


