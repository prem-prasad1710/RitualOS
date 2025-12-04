import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * POST /api/challenges/checkin
 * Check in to a challenge (mark a day as completed)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userChallengeId } = body

    if (!userChallengeId) {
      return NextResponse.json(
        { error: 'User challenge ID is required' },
        { status: 400 }
      )
    }

    // Get user challenge
    const userChallenge = await prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
      include: { challenge: true }
    })

    if (!userChallenge || userChallenge.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    if (userChallenge.status !== 'active') {
      return NextResponse.json(
        { error: 'Challenge is not active' },
        { status: 400 }
      )
    }

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0]
    const checkIns = (userChallenge.checkIns as string[]) || []
    
    if (checkIns.includes(today)) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      )
    }

    // Add check-in
    const updatedCheckIns = [...checkIns, today]
    const completedDays = updatedCheckIns.length
    const isCompleted = completedDays >= userChallenge.challenge.duration

    // Calculate streak (check if yesterday was checked in)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const hadYesterdayCheckin = checkIns.includes(yesterdayStr)
    
    const currentStreak = hadYesterdayCheckin 
      ? (userChallenge.currentStreak || 0) + 1 
      : 1

    // Update user challenge
    const updated = await prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: {
        checkIns: updatedCheckIns,
        completedDays,
        currentStreak,
        status: isCompleted ? 'completed' : 'active',
        completedAt: isCompleted ? new Date() : null
      },
      include: { challenge: true }
    })

    // If completed, award points to user
    if (isCompleted) {
      await prisma.user.update({
        where: { id: payload.userId },
        data: {
          totalPoints: { increment: userChallenge.challenge.points || 0 }
        }
      })
    }

    return NextResponse.json({ 
      userChallenge: updated,
      completed: isCompleted,
      pointsEarned: isCompleted ? userChallenge.challenge.points : 0
    })
  } catch (error) {
    console.error('Error checking in to challenge:', error)
    return NextResponse.json(
      { error: 'Failed to check in' },
      { status: 500 }
    )
  }
}

