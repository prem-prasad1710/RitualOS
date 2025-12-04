import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/challenges/my
 * Get user's challenges (active and completed)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId: payload.id },
      include: {
        challenge: true
      },
      orderBy: { startedAt: 'desc' }
    })

    // Separate active and completed
    const active = userChallenges.filter(uc => uc.status === 'active')
    const completed = userChallenges.filter(uc => uc.status === 'completed')
    const totalPointsEarned = completed.reduce((sum, uc) => sum + (uc.challenge.points || 0), 0)

    return NextResponse.json({
      active,
      completed,
      stats: {
        activeCount: active.length,
        completedCount: completed.length,
        totalPointsEarned
      }
    })
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user challenges' },
      { status: 500 }
    )
  }
}

