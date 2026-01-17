// Course and learning content types

export interface Course {
  id: string
  baserowId: string
  name: string
  description: string | null
  thumbnail: string | null
  category: string | null
  isPublished: boolean
  lessonsCount: number
  flashcardsCount: number
  testsCount: number
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  videoUrl: string | null
  order: number
  duration: number | null // in minutes
}

export interface Flashcard {
  id: string
  courseId: string
  lessonId: string | null
  front: string
  back: string
  category: string | null
  order: number
}

export interface TestConfig {
  id: string
  courseId: string
  title: string
  description: string | null
  timeLimit: number | null // in minutes
  passingScore: number // percentage
  questionsPerCategory: number // number of random questions to pick per category
}

export interface GeneratedTest extends TestConfig {
  questions: Question[]
  categories: string[] // list of categories included in this test
}

export interface Question {
  id: string
  category: string
  text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: QuestionOption[]
  correctAnswer: string
  explanation: string | null
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface TestAttempt {
  id: string
  testId: string
  startedAt: Date
  completedAt: Date | null
  score: number | null
  answers: AnswerRecord[]
}

export interface AnswerRecord {
  questionId: string
  answer: string
  isCorrect: boolean
}

// Session and authentication types
export interface SessionData {
  accessCodeId: string
  courseId: string
  courseName: string
  token: string
  expiresAt: Date
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Baserow API types
export interface BaserowRow {
  id: number
  [key: string]: unknown
}

export interface BaserowListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Baserow table row types (matching Baserow field names)
// Note: courseId is not in Baserow tables because each workspace = one course
export interface BaserowLessonRow extends BaserowRow {
  title: string
  description: string | null
  content: string
  videoUrl: string | null
  duration: number | null
}

export interface BaserowFlashcardRow extends BaserowRow {
  front: string
  back: string
  category: string | null
}

export interface BaserowTestRow extends BaserowRow {
  title: string
  description: string | null
  timeLimit: number | null
  passingScore: number
  questionsPerCategory: number
}

export interface BaserowQuestionRow extends BaserowRow {
  category: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string // A, B, C, or D
}
