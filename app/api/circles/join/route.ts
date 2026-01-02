import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * POST /api/circles/join
 * Join a circle using an invite code
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { inviteCode } = body

    if (!inviteCode || !inviteCode.trim()) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    // Find circle by invite code
    const circle = await prisma.circle.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
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

    if (!circle) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = circle.members.find(m => m.userId === payload.userId)
    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this circle' },
        { status: 400 }
      )
    }

    // Add user as member
    await prisma.circleMember.create({
      data: {
        circleId: circle.id,
        userId: payload.userId,
        role: 'member'
      }
    })

    // Fetch updated circle
    const updatedCircle = await prisma.circle.findUnique({
      where: { id: circle.id },
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

    return NextResponse.json({ circle: updatedCircle })
  } catch (error) {
    console.error('Error joining circle:', error)
    return NextResponse.json(
      { error: 'Failed to join circle' },
      { status: 500 }
    )
  }
}


