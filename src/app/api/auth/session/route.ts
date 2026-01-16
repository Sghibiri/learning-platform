import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ success: false, authenticated: false })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        courseId: session.courseId,
        courseName: session.courseName,
        expiresAt: session.expiresAt,
      },
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while checking session' },
      { status: 500 }
    )
  }
}
