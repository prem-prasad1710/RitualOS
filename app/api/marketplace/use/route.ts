import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * POST /api/marketplace/use
 * Use a community ritual template (increment use count and create ritual for user)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
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
    // Note: Ritual model doesn't store steps directly, those are for loops
    // We store the community ritual info in the description
    const stepsInfo = Array.isArray(communityRitual.steps) 
      ? communityRitual.steps.map((s: any, i: number) => `${i + 1}. ${s.name} (${s.duration}min)`).join('\n')
      : ''
    
    const ritual = await prisma.ritual.create({
      data: {
        userId: payload.userId,
        name: customize?.name || communityRitual.name,
        category: communityRitual.category,
        description: `${customize?.description || communityRitual.description}\n\nSteps:\n${stepsInfo}\n\n(From Community Marketplace)`,
        durationMinutes: communityRitual.duration,
        isPublic: false,
        isTemplate: false
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

