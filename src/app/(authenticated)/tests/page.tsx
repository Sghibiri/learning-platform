'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ClipboardCheck,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  options: { id: string; text: string }[]
  correctAnswer: string
}

interface Test {
  id: string
  title: string
  description: string
  timeLimit: number | null // in minutes
  passingScore: number
  questionsCount: number
  questions: Question[]
  bestScore: number | null
  attempts: number
}

// Mock data
const mockTests: Test[] = [
  {
    id: '1',
    title: 'Chapter 1 Quiz',
    description: 'Test your understanding of the introductory concepts',
    timeLimit: 10,
    passingScore: 70,
    questionsCount: 5,
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: [
          { id: 'a', text: 'London' },
          { id: 'b', text: 'Paris' },
          { id: 'c', text: 'Berlin' },
          { id: 'd', text: 'Madrid' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q2',
        text: 'Which planet is known as the Red Planet?',
        options: [
          { id: 'a', text: 'Venus' },
          { id: 'b', text: 'Jupiter' },
          { id: 'c', text: 'Mars' },
          { id: 'd', text: 'Saturn' },
        ],
        correctAnswer: 'c',
      },
      {
        id: 'q3',
        text: 'What is the chemical symbol for gold?',
        options: [
          { id: 'a', text: 'Go' },
          { id: 'b', text: 'Gd' },
          { id: 'c', text: 'Au' },
          { id: 'd', text: 'Ag' },
        ],
        correctAnswer: 'c',
      },
      {
        id: 'q4',
        text: 'Who wrote "1984"?',
        options: [
          { id: 'a', text: 'Aldous Huxley' },
          { id: 'b', text: 'George Orwell' },
          { id: 'c', text: 'Ray Bradbury' },
          { id: 'd', text: 'H.G. Wells' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q5',
        text: 'What is the largest ocean on Earth?',
        options: [
          { id: 'a', text: 'Atlantic Ocean' },
          { id: 'b', text: 'Indian Ocean' },
          { id: 'c', text: 'Arctic Ocean' },
          { id: 'd', text: 'Pacific Ocean' },
        ],
        correctAnswer: 'd',
      },
    ],
    bestScore: 80,
    attempts: 2,
  },
  {
    id: '2',
    title: 'Midterm Exam',
    description: 'Comprehensive test covering chapters 1-5',
    timeLimit: 30,
    passingScore: 65,
    questionsCount: 10,
    questions: [],
    bestScore: null,
    attempts: 0,
  },
  {
    id: '3',
    title: 'Final Assessment',
    description: 'Final test covering all course material',
    timeLimit: 45,
    passingScore: 70,
    questionsCount: 20,
    questions: [],
    bestScore: null,
    attempts: 0,
  },
]

type TestState = 'list' | 'taking' | 'results'

interface TestResult {
  score: number
  correct: number
  total: number
  passed: boolean
  answers: Record<string, { selected: string; correct: string; isCorrect: boolean }>
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [testState, setTestState] = useState<TestState>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)

  const loadTests = useCallback(async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTests(mockTests)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadTests()
  }, [loadTests])

  const startTest = (test: Test) => {
    setSelectedTest(test)
    setAnswers({})
    setCurrentQuestion(0)
    setTimeRemaining(test.timeLimit ? test.timeLimit * 60 : null)
    setTestState('taking')
    setShowTimeWarning(false)
  }

  const submitTest = useCallback(() => {
    if (!selectedTest) return

    const results: TestResult['answers'] = {}
    let correctCount = 0

    selectedTest.questions.forEach((question) => {
      const selected = answers[question.id] || ''
      const isCorrect = selected === question.correctAnswer
      if (isCorrect) correctCount++
      results[question.id] = {
        selected,
        correct: question.correctAnswer,
        isCorrect,
      }
    })

    const score = Math.round((correctCount / selectedTest.questions.length) * 100)
    const passed = score >= selectedTest.passingScore

    setTestResult({
      score,
      correct: correctCount,
      total: selectedTest.questions.length,
      passed,
      answers: results,
    })

    setTestState('results')
    setShowConfirmSubmit(false)

    // Update test stats
    setTests((prev) =>
      prev.map((t) =>
        t.id === selectedTest.id
          ? {
              ...t,
              attempts: t.attempts + 1,
              bestScore: t.bestScore === null ? score : Math.max(t.bestScore, score),
            }
          : t
      )
    )
  }, [selectedTest, answers])

  // Timer effect
  useEffect(() => {
    if (testState !== 'taking' || timeRemaining === null) return

    if (timeRemaining <= 0) {
      submitTest()
      return
    }

    if (timeRemaining === 60 && !showTimeWarning) {
      setShowTimeWarning(true)
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [testState, timeRemaining, showTimeWarning, submitTest])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const backToList = () => {
    setTestState('list')
    setSelectedTest(null)
    setTestResult(null)
    setAnswers({})
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Test List View
  if (testState === 'list') {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Practice Tests
          </h1>
          <p className="text-muted-foreground mt-1">
            Test your knowledge with timed quizzes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  {test.bestScore !== null && (
                    <Badge
                      variant={
                        test.bestScore >= test.passingScore
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        test.bestScore >= test.passingScore
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : ''
                      }
                    >
                      Best: {test.bestScore}%
                    </Badge>
                  )}
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ClipboardCheck className="h-4 w-4" />
                      {test.questionsCount} questions
                    </span>
                    {test.timeLimit && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.timeLimit} min
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Passing:</span>
                    <Badge variant="outline">{test.passingScore}%</Badge>
                    {test.attempts > 0 && (
                      <>
                        <span className="text-muted-foreground ml-2">Attempts:</span>
                        <span>{test.attempts}</span>
                      </>
                    )}
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => startTest(test)}
                    disabled={test.questions.length === 0}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                  </Button>
                  {test.questions.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Coming soon
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Taking Test View
  if (testState === 'taking' && selectedTest) {
    const question = selectedTest.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100
    const answeredCount = Object.keys(answers).length

    return (
      <div className="container py-8 max-w-3xl">
        {/* Timer Warning */}
        {showTimeWarning && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Time Warning</AlertTitle>
            <AlertDescription>
              Less than 1 minute remaining! Your test will be automatically submitted.
            </AlertDescription>
          </Alert>
        )}

        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">{selectedTest.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {selectedTest.questions.length}
            </p>
          </div>
          {timeRemaining !== null && (
            <div
              className={cn(
                'flex items-center gap-2 text-lg font-mono font-bold px-4 py-2 rounded-lg',
                timeRemaining <= 60
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-muted'
              )}
            >
              <Timer className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-8" />

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            >
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      answers[question.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted'
                    )}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                    }
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {answeredCount} of {selectedTest.questions.length} answered
          </span>

          {currentQuestion === selectedTest.questions.length - 1 ? (
            <Button onClick={() => setShowConfirmSubmit(true)}>
              Submit Test
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion((prev) => prev + 1)}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {selectedTest.questions.map((q, index) => (
              <Button
                key={q.id}
                variant="outline"
                size="sm"
                className={cn(
                  'w-10 h-10',
                  answers[q.id] && 'bg-primary text-primary-foreground',
                  currentQuestion === index && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Confirm Submit Dialog */}
        <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Test?</DialogTitle>
              <DialogDescription>
                You have answered {answeredCount} of {selectedTest.questions.length}{' '}
                questions.
                {answeredCount < selectedTest.questions.length && (
                  <span className="block mt-2 text-orange-600 dark:text-orange-400">
                    Warning: You have {selectedTest.questions.length - answeredCount}{' '}
                    unanswered questions.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                Continue Test
              </Button>
              <Button onClick={submitTest}>Submit Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Results View
  if (testState === 'results' && selectedTest && testResult) {
    return (
      <div className="container py-8 max-w-3xl">
        {/* Results Header */}
        <Card
          className={cn(
            'mb-8',
            testResult.passed
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
              : 'border-red-500 bg-red-50 dark:bg-red-950/20'
          )}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              {testResult.passed ? (
                <Trophy className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">
                {testResult.passed ? 'Congratulations!' : 'Keep Practicing'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {testResult.passed
                  ? 'You passed the test!'
                  : `You need ${selectedTest.passingScore}% to pass.`}
              </p>
              <div className="text-5xl font-bold mb-2">{testResult.score}%</div>
              <p className="text-muted-foreground">
                {testResult.correct} of {testResult.total} correct
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <h3 className="text-lg font-semibold mb-4">Review Answers</h3>
        <div className="space-y-4 mb-8">
          {selectedTest.questions.map((question, index) => {
            const result = testResult.answers[question.id]
            const selectedOption = question.options.find(
              (o) => o.id === result.selected
            )
            const correctOption = question.options.find(
              (o) => o.id === result.correct
            )

            return (
              <Card
                key={question.id}
                className={cn(
                  'border-l-4',
                  result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                )}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.text}
                      </p>
                      {!result.isCorrect && (
                        <div className="space-y-1 text-sm">
                          <p className="text-red-600 dark:text-red-400">
                            Your answer: {selectedOption?.text || 'Not answered'}
                          </p>
                          <p className="text-green-600 dark:text-green-400">
                            Correct answer: {correctOption?.text}
                          </p>
                        </div>
                      )}
                      {result.isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Correct: {correctOption?.text}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={backToList} className="flex-1">
            Back to Tests
          </Button>
          <Button onClick={() => startTest(selectedTest)} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Test
          </Button>
        </div>
      </div>
    )
  }

  return null
}
