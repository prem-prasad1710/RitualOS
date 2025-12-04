/**
 * Authentication Utilities
 * 
 * Handles JWT token generation, validation, and password hashing
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

type TokenPayload = {
  userId: string
  email: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract user from Authorization header
 */
export function getUserFromAuthHeader(authHeader: string | null): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  return verifyToken(token)
}

/**
 * Extract and verify token from NextRequest
 */
export function getUserFromRequest(request: Request): TokenPayload | null {
  const authHeader = request.headers.get('Authorization')
  return getUserFromAuthHeader(authHeader)
}

