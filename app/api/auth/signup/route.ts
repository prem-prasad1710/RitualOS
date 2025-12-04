/**
 * User Signup API Route
 * 
 * POST /api/auth/signup
 * Creates a new user account
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, focusGoal } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        focusGoal: focusGoal || null,
        streakCount: 0,
        totalPoints: 0,
        level: 1
      },
      select: {
        id: true,
        name: true,
        email: true,
        focusGoal: true,
        streakCount: true,
        totalPoints: true,
        level: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = generateToken(user)

    return NextResponse.json(
      {
        user,
        token
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

