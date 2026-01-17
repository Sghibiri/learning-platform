import { NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowTestRow, Test } from '@/types'

function transformTest(row: BaserowTestRow, courseId: string): Omit<Test, 'questions'> & { questions: [] } {
  return {
    id: row.id.toString(),
    courseId,
    lessonId: null,
    title: row.title,
    description: row.description,
    timeLimit: row.timeLimit,
    passingScore: row.passingScore,
    questions: [],
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
    const rows = await baserow.getAllRows<BaserowTestRow>(config.testsTableId, {
      orderBy: 'orderr',
    })

    const tests = rows.map(row => transformTest(row, courseId))

    return NextResponse.json({
      success: true,
      data: tests,
    })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}
