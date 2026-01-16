import { NextRequest, NextResponse } from 'next/server'
import { validateAccessCode, createSession, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Access code is required' },
        { status: 400 }
      )
    }

    const result = await validateAccessCode(code.trim().toUpperCase())

    if (!result.valid || !result.accessCode) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    // Create session and set cookie
    const token = await createSession(result.accessCode.id)
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      data: {
        courseId: result.accessCode.courseId,
        courseName: result.accessCode.courseName,
      },
    })
  } catch (error) {
    console.error('Error validating access code:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while validating the access code' },
      { status: 500 }
    )
  }
}
