import { NextResponse } from 'next/server'
import { createBaserowClient } from '@/lib/baserow'
import { getBaserowConfig } from '@/lib/session'
import type { BaserowFlashcardRow, Flashcard } from '@/types'

function transformFlashcard(row: BaserowFlashcardRow, courseId: string): Flashcard {
  return {
    id: row.id.toString(),
    courseId,
    lessonId: null,
    front: row.front,
    back: row.back,
    category: row.category,
    order: row.id, // Use Baserow row ID for ordering
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
    const rows = await baserow.getAllRows<BaserowFlashcardRow>(config.flashcardsTableId)

    const flashcards = rows.map(row => transformFlashcard(row, courseId))

    return NextResponse.json({
      success: true,
      data: flashcards,
    })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}
