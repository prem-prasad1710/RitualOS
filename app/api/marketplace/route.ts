import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/marketplace
 * Get all community rituals from the marketplace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'popular'

    // Build where clause
    const where: any = {}
    if (category && category !== 'All') {
      where.category = category
    }

    // Build order by clause
    let orderBy: any = { usesCount: 'desc' } // Most Popular (default)
    if (sortBy === 'rating') {
      orderBy = { rating: 'desc' }
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (sortBy === 'shortest') {
      orderBy = { duration: 'asc' }
    }

    const rituals = await prisma.communityRitual.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: false
          }
        }
      }
    })

    return NextResponse.json({ rituals })
  } catch (error) {
    console.error('Error fetching marketplace rituals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rituals' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketplace
 * Share a new ritual to the marketplace
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, duration, steps } = body

    if (!name || !description || !category || !duration || !steps) {
      return NextResponse.json(
        { error: 'Name, description, category, duration, and steps are required' },
        { status: 400 }
      )
    }

    const ritual = await prisma.communityRitual.create({
      data: {
        authorId: payload.id,
        name,
        description,
        category,
        duration,
        steps,
        usesCount: 0,
        rating: 0,
        authorAvatar: '👤'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: false
          }
        }
      }
    })

    return NextResponse.json({ ritual }, { status: 201 })
  } catch (error) {
    console.error('Error creating marketplace ritual:', error)
    return NextResponse.json(
      { error: 'Failed to create ritual' },
      { status: 500 }
    )
  }
}

