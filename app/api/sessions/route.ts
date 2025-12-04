/**
 * Sessions API Routes
 * 
 * GET /api/sessions - Get all sessions for current user
 * POST /api/sessions - Create a new session
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromAuthHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const user = getUserFromAuthHeader(authHeader)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.ritualSession.findMany({
      where: { userId: user.userId },
      include: {
        loop: true,
        reflections: true
      },
      orderBy: { startedAt: 'desc' },
      take: 50 // Last 50 sessions
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const user = getUserFromAuthHeader(authHeader)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { loopId, selfReportedMoodBefore } = body

    const session = await prisma.ritualSession.create({
      data: {
        userId: user.userId,
        loopId: loopId || null,
        selfReportedMoodBefore: selfReportedMoodBefore || null
      }
    })

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

