import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * POST /api/marketplace/rate
 * Rate a community ritual
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { communityRitualId, rating } = body

    if (!communityRitualId || rating === undefined) {
      return NextResponse.json(
        { error: 'Community ritual ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Get current ritual
    const communityRitual = await prisma.communityRitual.findUnique({
      where: { id: communityRitualId }
    })

    if (!communityRitual) {
      return NextResponse.json(
        { error: 'Ritual not found' },
        { status: 404 }
      )
    }

    // Simple rating calculation (in production, you'd store individual ratings)
    // For now, we'll do a weighted average
    const currentRating = communityRitual.rating || 0
    const usesCount = communityRitual.usesCount || 1
    const newRating = ((currentRating * usesCount) + rating) / (usesCount + 1)

    await prisma.communityRitual.update({
      where: { id: communityRitualId },
      data: { rating: newRating }
    })

    return NextResponse.json({ 
      rating: newRating,
      message: 'Thank you for rating!' 
    })
  } catch (error) {
    console.error('Error rating ritual:', error)
    return NextResponse.json(
      { error: 'Failed to rate ritual' },
      { status: 500 }
    )
  }
}

