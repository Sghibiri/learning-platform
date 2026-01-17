import { NextRequest, NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowTestRow, BaserowQuestionRow, GeneratedTest, Question } from '@/types'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params
    const { config, courseId, error } = await getBaserowConfig()

    if (!config || !courseId) {
      return NextResponse.json(
        { success: false, error: error || 'Baserow not configured' },
        { status: config === null && error === 'Not authenticated' ? 401 : 500 }
      )
    }

    const baserow = createBaserowClient(config.apiToken)

    // Fetch the test configuration
    const testRow = await baserow.getRow<BaserowTestRow>(config.testsTableId, parseInt(testId))

    if (!testRow) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    const questionsPerCategory = testRow.questionsPerCategory || 5

    // Fetch all questions
    const allQuestions = await baserow.getAllRows<BaserowQuestionRow>(config.questionsTableId)

    // Group questions by category
    const questionsByCategory = new Map<string, BaserowQuestionRow[]>()
    for (const q of allQuestions) {
      const category = q.category || 'Uncategorized'
      if (!questionsByCategory.has(category)) {
        questionsByCategory.set(category, [])
      }
      questionsByCategory.get(category)!.push(q)
    }

    // Randomly select questions from each category
    const selectedQuestions: Question[] = []
    const categories: string[] = []

    for (const [category, questions] of questionsByCategory) {
      categories.push(category)
      const shuffled = shuffleArray(questions)
      const selected = shuffled.slice(0, questionsPerCategory)
      selectedQuestions.push(...selected.map(transformQuestion))
    }

    // Shuffle the final question order
    const finalQuestions = shuffleArray(selectedQuestions)

    const generatedTest: GeneratedTest = {
      id: testRow.id.toString(),
      courseId,
      title: testRow.title,
      description: testRow.description,
      timeLimit: testRow.timeLimit,
      passingScore: testRow.passingScore,
      questionsPerCategory,
      questions: finalQuestions,
      categories,
    }

    return NextResponse.json({
      success: true,
      data: generatedTest,
    })
  } catch (error) {
    console.error('Error generating test:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate test' },
      { status: 500 }
    )
  }
}
