import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/challenges
 * Get all available challenges
 */
export async function GET(request: NextRequest) {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/challenges
 * Create a new challenge (admin/future feature)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, difficulty, points, goal, benefits, icon, color } = body

    if (!name || !description || !duration) {
      return NextResponse.json(
        { error: 'Name, description, and duration are required' },
        { status: 400 }
      )
    }

    const challenge = await prisma.challenge.create({
      data: {
        name,
        description,
        duration,
        difficulty: difficulty || 'Medium',
        points: points || 100,
        goal: goal || `Complete ${name} for ${duration} days`,
        benefits: benefits || [],
        icon: icon || '🎯',
        color: color || 'from-purple-500 to-pink-500'
      }
    })

    return NextResponse.json({ challenge }, { status: 201 })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}

