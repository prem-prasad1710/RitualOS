import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/circles
 * Get all circles the user is a member of
 */
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const circles = await prisma.circle.findMany({
      where: {
        members: {
          some: {
            userId: payload.userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                streakCount: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ circles })
  } catch (error) {
    console.error('Error fetching circles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circles' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/circles
 * Create a new circle
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Circle name is required' },
        { status: 400 }
      )
    }

    // Generate unique invite code
    const inviteCode = generateInviteCode()

    // Create circle with the user as owner
    const circle = await prisma.circle.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        inviteCode,
        members: {
          create: {
            userId: payload.userId,
            role: 'owner'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                streakCount: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ circle })
  } catch (error) {
    console.error('Error creating circle:', error)
    return NextResponse.json(
      { error: 'Failed to create circle' },
      { status: 500 }
    )
  }
}

/**
 * Generate a random invite code (e.g., ABCD-1234-WXYZ)
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = []
  
  for (let i = 0; i < 3; i++) {
    let segment = ''
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  
  return segments.join('-')
}


