import { NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowTestRow, TestConfig } from '@/types'

function transformTestConfig(row: BaserowTestRow, courseId: string): TestConfig {
  return {
    id: row.id.toString(),
    courseId,
    title: row.title,
    description: row.description,
    timeLimit: row.timeLimit,
    passingScore: row.passingScore,
    questionsPerCategory: row.questionsPerCategory || 5, // default to 5 if not set
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
    const rows = await baserow.getAllRows<BaserowTestRow>(config.testsTableId)

    const tests = rows.map(row => transformTestConfig(row, courseId))

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
