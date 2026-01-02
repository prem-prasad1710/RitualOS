import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * POST /api/habit-stacks/[id]/toggle
 * Toggle active state of a habit stack
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

    const body = await request.json()
    const { isActive } = body

    const stack = await prisma.ritualLoop.findUnique({
      where: { id: params.id }
    })

    if (!stack || stack.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Stack not found' },
        { status: 404 }
      )
    }

    // Update the ACTIVE flag in description
    const updatedDescription = stack.description?.replace(
      /\[ACTIVE:(.*?)\]/,
      `[ACTIVE:${isActive}]`
    )

    await prisma.ritualLoop.update({
      where: { id: params.id },
      data: { description: updatedDescription }
    })

    return NextResponse.json({ message: 'Stack updated successfully' })
  } catch (error) {
    console.error('Error toggling habit stack:', error)
    return NextResponse.json(
      { error: 'Failed to toggle habit stack' },
      { status: 500 }
    )
  }
}


