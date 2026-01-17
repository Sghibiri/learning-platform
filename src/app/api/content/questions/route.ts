import { NextRequest, NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowQuestionRow, Question } from '@/types'

function transformQuestion(row: BaserowQuestionRow): Question {
  const answerMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
  const correctIndex = answerMap[row.correctAnswer.toUpperCase()] ?? 0

  return {
    id: row.id.toString(),
    category: row.category,
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
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const { config, error } = await getBaserowConfig()

    if (!config) {
      return NextResponse.json(
        { success: false, error: error || 'Baserow not configured' },
        { status: error === 'Not authenticated' ? 401 : 500 }
      )
    }

    const baserow = createBaserowClient(config.apiToken)

    // Build filters if category is specified
    const filters: Record<string, string> | undefined = category
      ? { 'filter__category__equal': category }
      : undefined

    const rows = await baserow.getAllRows<BaserowQuestionRow>(config.questionsTableId, {
      filters,
    })

    const questions = rows.map(transformQuestion)

    // Group by category for the response
    const categories = [...new Set(questions.map(q => q.category))]

    return NextResponse.json({
      success: true,
      data: questions,
      meta: {
        total: questions.length,
        categories,
      },
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
