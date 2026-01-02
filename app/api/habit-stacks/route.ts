import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * GET /api/habit-stacks
 * Get all habit stacks for the user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, we'll use RitualLoop to store habit stacks
    // We'll add metadata to distinguish habit stacks from regular loops
    const stacks = await prisma.ritualLoop.findMany({
      where: {
        userId: payload.userId,
        // Filter for loops that have metadata indicating they're habit stacks
        description: { contains: '[HABIT_STACK]' }
      },
      include: {
        steps: {
          include: {
            ritual: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedStacks = stacks.map(stack => {
      // Parse trigger from description
      const triggerMatch = stack.description?.match(/\[TRIGGER:(.*?)\]/)
      const trigger = triggerMatch ? JSON.parse(triggerMatch[1]) : { type: 'time', value: '08:00' }
      
      const isActiveMatch = stack.description?.match(/\[ACTIVE:(.*?)\]/)
      const isActive = isActiveMatch ? isActiveMatch[1] === 'true' : true

      return {
        id: stack.id,
        name: stack.name,
        description: stack.description?.replace(/\[HABIT_STACK\]|\[TRIGGER:.*?\]|\[ACTIVE:.*?\]/g, '').trim(),
        trigger,
        rituals: stack.steps.map(step => ({
          id: step.id,
          order: step.order,
          ritual: {
            id: step.ritual.id,
            name: step.ritual.name,
            category: step.ritual.category,
            durationMinutes: step.ritual.durationMinutes
          }
        })),
        isActive,
        createdAt: stack.createdAt.toISOString()
      }
    })

    return NextResponse.json({ stacks: formattedStacks })
  } catch (error) {
    console.error('Error fetching habit stacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habit stacks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/habit-stacks
 * Create a new habit stack
 */
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, trigger, ritualIds } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Stack name is required' },
        { status: 400 }
      )
    }

    if (!trigger || !trigger.type || !trigger.value) {
      return NextResponse.json(
        { error: 'Valid trigger is required' },
        { status: 400 }
      )
    }

    if (!ritualIds || ritualIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one ritual is required' },
        { status: 400 }
      )
    }

    // Verify all rituals exist and belong to user
    const rituals = await prisma.ritual.findMany({
      where: {
        id: { in: ritualIds },
        userId: payload.userId
      }
    })

    if (rituals.length !== ritualIds.length) {
      return NextResponse.json(
        { error: 'Some rituals not found' },
        { status: 404 }
      )
    }

    // Create as a RitualLoop with special markers
    const metaDescription = `[HABIT_STACK][TRIGGER:${JSON.stringify(trigger)}][ACTIVE:true]${description || ''}`
    
    const stack = await prisma.ritualLoop.create({
      data: {
        userId: payload.userId,
        name: name.trim(),
        description: metaDescription,
        steps: {
          create: ritualIds.map((ritualId: string, index: number) => ({
            ritualId,
            order: index
          }))
        }
      },
      include: {
        steps: {
          include: {
            ritual: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({
      stack: {
        id: stack.id,
        name: stack.name,
        description: description || '',
        trigger,
        rituals: stack.steps.map(step => ({
          id: step.id,
          order: step.order,
          ritual: {
            id: step.ritual.id,
            name: step.ritual.name,
            category: step.ritual.category,
            durationMinutes: step.ritual.durationMinutes
          }
        })),
        isActive: true,
        createdAt: stack.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error creating habit stack:', error)
    return NextResponse.json(
      { error: 'Failed to create habit stack' },
      { status: 500 }
    )
  }
}


