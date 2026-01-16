import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'

export async function POST() {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while logging out' },
      { status: 500 }
    )
  }
}
