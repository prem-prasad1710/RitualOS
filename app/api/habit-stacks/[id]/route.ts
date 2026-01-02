import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

/**
 * DELETE /api/habit-stacks/[id]
 * Delete a habit stack
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stack = await prisma.ritualLoop.findUnique({
      where: { id: params.id }
    })

    if (!stack || stack.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Stack not found' },
        { status: 404 }
      )
    }

    await prisma.ritualLoop.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Stack deleted successfully' })
  } catch (error) {
    console.error('Error deleting habit stack:', error)
    return NextResponse.json(
      { error: 'Failed to delete habit stack' },
      { status: 500 }
    )
  }
}


