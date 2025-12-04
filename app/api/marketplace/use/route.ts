import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * POST /api/marketplace/use
 * Use a community ritual template (increment use count and create ritual for user)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { communityRitualId, customize } = body

    if (!communityRitualId) {
      return NextResponse.json(
        { error: 'Community ritual ID is required' },
        { status: 400 }
      )
    }

    // Get community ritual
    const communityRitual = await prisma.communityRitual.findUnique({
      where: { id: communityRitualId }
    })

    if (!communityRitual) {
      return NextResponse.json(
        { error: 'Ritual template not found' },
        { status: 404 }
      )
    }

    // Increment use count
    await prisma.communityRitual.update({
      where: { id: communityRitualId },
      data: { usesCount: { increment: 1 } }
    })

    // Create ritual for user based on template
    const ritual = await prisma.ritual.create({
      data: {
        userId: payload.id,
        name: customize?.name || communityRitual.name,
        category: communityRitual.category,
        description: customize?.description || communityRitual.description,
        duration: communityRitual.duration,
        steps: communityRitual.steps,
        // Track that it came from community
        metadata: {
          fromCommunity: true,
          communityRitualId: communityRitualId
        }
      }
    })

    return NextResponse.json({ 
      ritual,
      message: 'Ritual added to your collection!' 
    }, { status: 201 })
  } catch (error) {
    console.error('Error using marketplace ritual:', error)
    return NextResponse.json(
      { error: 'Failed to use ritual' },
      { status: 500 }
    )
  }
}

