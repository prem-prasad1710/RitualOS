/**
 * Ritual Loops API Routes
 * 
 * GET /api/loops - Get all loops for current user
 * POST /api/loops - Create a new loop
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

    const loops = await prisma.ritualLoop.findMany({
      where: { userId: user.userId },
      include: {
        steps: {
          include: {
            ritual: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ loops })
  } catch (error) {
    console.error('Get loops error:', error)
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
    const { name, description, steps } = body

    if (!name || !steps || steps.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one step are required' },
        { status: 400 }
      )
    }

    // Create loop and steps in a transaction
    const loop = await prisma.ritualLoop.create({
      data: {
        userId: user.userId,
        name,
        description: description || null,
        steps: {
          create: steps.map((ritualId: string, index: number) => ({
            ritualId,
            order: index
          }))
        }
      },
      include: {
        steps: {
          include: {
            ritual: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json({ loop }, { status: 201 })
  } catch (error) {
    console.error('Create loop error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

