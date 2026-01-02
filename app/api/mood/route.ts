import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/mood
 * Get all mood entries for the user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: payload.userId,
        mood: { not: null }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      entries: entries.map(e => ({
        id: e.id,
        mood: e.mood,
        energy: e.energy || 3,
        note: e.content,
        createdAt: e.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/mood
 * Create a new mood entry
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mood, energy, note } = body

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood is required' },
        { status: 400 }
      )
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: payload.userId,
        mood,
        energy: energy || 3,
        content: note || '',
        tags: 'mood-tracking'
      }
    })

    return NextResponse.json({ 
      entry: {
        id: entry.id,
        mood: entry.mood,
        energy: entry.energy,
        note: entry.content,
        createdAt: entry.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error creating mood entry:', error)
    return NextResponse.json(
      { error: 'Failed to create mood entry' },
      { status: 500 }
    )
  }
}


