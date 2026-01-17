import { NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowLessonRow, Lesson } from '@/types'

function transformLesson(row: BaserowLessonRow, courseId: string): Lesson {
  return {
    id: row.id.toString(),
    courseId,
    title: row.title,
    content: row.content,
    videoUrl: row.videoUrl,
    order: parseInt(row.orderr) || 0,
    duration: row.duration,
  }
}

export async function GET() {
  try {
    const { config, courseId, error } = await getBaserowConfig()

    if (!config || !courseId) {
      return NextResponse.json(
        { success: false, error: error || 'Baserow not configured' },
        { status: config === null && error === 'Not authenticated' ? 401 : 500 }
      )
    }

    const baserow = createBaserowClient(config.apiToken)
    const rows = await baserow.getAllRows<BaserowLessonRow>(config.lessonsTableId, {
      orderBy: 'orderr',
    })

    const lessons = rows.map(row => transformLesson(row, courseId))

    return NextResponse.json({
      success: true,
      data: lessons,
    })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}
