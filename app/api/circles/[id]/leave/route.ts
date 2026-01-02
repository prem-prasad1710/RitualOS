import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * POST /api/circles/[id]/leave
 * Leave a circle
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const circleId = params.id

    // Find the membership
    const membership = await prisma.circleMember.findFirst({
      where: {
        circleId,
        userId: payload.userId
      },
      include: {
        circle: {
          include: {
            members: true
          }
        }
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this circle' },
        { status: 404 }
      )
    }

    // If user is the owner and there are other members, prevent leaving
    if (membership.role === 'owner' && membership.circle.members.length > 1) {
      return NextResponse.json(
        { error: 'Circle owner cannot leave while there are other members. Transfer ownership or remove all members first.' },
        { status: 400 }
      )
    }

    // Delete membership
    await prisma.circleMember.delete({
      where: {
        id: membership.id
      }
    })

    // If this was the last member, delete the circle
    if (membership.circle.members.length === 1) {
      await prisma.circle.delete({
        where: { id: circleId }
      })
    }

    return NextResponse.json({ message: 'Left circle successfully' })
  } catch (error) {
    console.error('Error leaving circle:', error)
    return NextResponse.json(
      { error: 'Failed to leave circle' },
      { status: 500 }
    )
  }
}


