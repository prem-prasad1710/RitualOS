import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * POST /api/challenges/join
 * Join a challenge
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId } = body

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      )
    }

    // Check if challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Check if user already joined this challenge
    const existingUserChallenge = await prisma.userChallenge.findFirst({
      where: {
        userId: payload.id,
        challengeId,
        status: { in: ['active', 'completed'] }
      }
    })

    if (existingUserChallenge) {
      return NextResponse.json(
        { error: 'You have already joined this challenge' },
        { status: 400 }
      )
    }

    // Create user challenge
    const userChallenge = await prisma.userChallenge.create({
      data: {
        userId: payload.id,
        challengeId,
        status: 'active',
        currentStreak: 0,
        completedDays: 0,
        checkIns: []
      },
      include: {
        challenge: true
      }
    })

    return NextResponse.json({ userChallenge }, { status: 201 })
  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    )
  }
}

