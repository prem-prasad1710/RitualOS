/**
 * Rituals API Routes
 * 
 * GET /api/rituals - Get all rituals for current user
 * POST /api/rituals - Create a new ritual
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

    const rituals = await prisma.ritual.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ rituals })
  } catch (error) {
    console.error('Get rituals error:', error)
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
    const { name, category, durationMinutes, moodTag, description } = body

    if (!name || !category || !durationMinutes) {
      return NextResponse.json(
        { error: 'Name, category, and duration are required' },
        { status: 400 }
      )
    }

    const ritual = await prisma.ritual.create({
      data: {
        userId: user.userId,
        name,
        category,
        durationMinutes,
        moodTag: moodTag || null,
        description: description || null
      }
    })

    return NextResponse.json({ ritual }, { status: 201 })
  } catch (error) {
    console.error('Create ritual error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

