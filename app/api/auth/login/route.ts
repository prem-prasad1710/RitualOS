/**
 * User Login API Route
 * 
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePasswords, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePasswords(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      focusGoal: user.focusGoal,
      createdAt: user.createdAt
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        focusGoal: user.focusGoal,
        createdAt: user.createdAt
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

