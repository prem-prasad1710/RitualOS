/**
 * Get Current User API Route
 * 
 * GET /api/auth/me
 * Returns the currently authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromAuthHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const tokenPayload = getUserFromAuthHeader(authHeader)

    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        focusGoal: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

