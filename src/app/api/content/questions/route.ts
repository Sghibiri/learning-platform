import { NextRequest, NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowQuestionRow, Question } from '@/types'

function transformQuestion(row: BaserowQuestionRow): Question {
  const answerMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
  const correctIndex = answerMap[row.correctAnswer.toUpperCase()] ?? 0

  return {
    id: row.id.toString(),
    testId: row.testId.toString(),
    text: row.question,
    type: 'multiple_choice',
    options: [
      { id: 'a', text: row.optionA, isCorrect: correctIndex === 0 },
      { id: 'b', text: row.optionB, isCorrect: correctIndex === 1 },
      { id: 'c', text: row.optionC, isCorrect: correctIndex === 2 },
      { id: 'd', text: row.optionD, isCorrect: correctIndex === 3 },
    ],
    correctAnswer: row.correctAnswer.toLowerCase(),
    explanation: null,
    order: parseInt(row.orderr) || 0,
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const testId = searchParams.get('testId')

    if (!testId) {
      return NextResponse.json(
        { success: false, error: 'testId parameter is required' },
        { status: 400 }
      )
    }

    const { config, error } = await getBaserowConfig()

    if (!config) {
      return NextResponse.json(
        { success: false, error: error || 'Baserow not configured' },
        { status: error === 'Not authenticated' ? 401 : 500 }
      )
    }

    const baserow = createBaserowClient(config.apiToken)
    const filters: Record<string, string> = {
      'filter__testId__equal': testId,
    }

    const rows = await baserow.getAllRows<BaserowQuestionRow>(config.questionsTableId, {
      filters,
      orderBy: 'orderr',
    })

    const questions = rows.map(transformQuestion)

    return NextResponse.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
