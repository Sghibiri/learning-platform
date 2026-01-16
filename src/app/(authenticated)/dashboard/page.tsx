'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  PlayCircle,
  ArrowRight,
  Trophy,
  Clock,
} from 'lucide-react'

interface CourseStats {
  lessonsTotal: number
  lessonsCompleted: number
  flashcardsTotal: number
  flashcardsStudied: number
  testsTotal: number
  testsCompleted: number
  averageScore: number
}

interface SessionData {
  courseId: string
  courseName: string
}

export default function DashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get session data
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()

      if (sessionData.authenticated) {
        setSession(sessionData.data)
      }

      // For now, use mock stats - will be replaced with real API calls
      setStats({
        lessonsTotal: 12,
        lessonsCompleted: 4,
        flashcardsTotal: 48,
        flashcardsStudied: 24,
        testsTotal: 6,
        testsCompleted: 2,
        averageScore: 78,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  const lessonsProgress = stats
    ? Math.round((stats.lessonsCompleted / stats.lessonsTotal) * 100)
    : 0
  const flashcardsProgress = stats
    ? Math.round((stats.flashcardsStudied / stats.flashcardsTotal) * 100)
    : 0
  const testsProgress = stats
    ? Math.round((stats.testsCompleted / stats.testsTotal) * 100)
    : 0

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-1">
          Continue your learning journey in{' '}
          <span className="font-medium text-foreground">
            {session?.courseName || 'your course'}
          </span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.lessonsCompleted}/{stats?.lessonsTotal}
                </p>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.flashcardsStudied}/{stats?.flashcardsTotal}
                </p>
                <p className="text-sm text-muted-foreground">Flashcards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.testsCompleted}/{stats?.testsTotal}
                </p>
                <p className="text-sm text-muted-foreground">Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Content/Lessons Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary">
                {lessonsProgress}% complete
              </Badge>
            </div>
            <CardTitle className="mt-4">Course Content</CardTitle>
            <CardDescription>
              Access video lessons and reading materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={lessonsProgress} className="h-2 mb-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>
                {stats?.lessonsTotal && stats?.lessonsCompleted
                  ? stats.lessonsTotal - stats.lessonsCompleted
                  : 0}{' '}
                lessons remaining
              </span>
            </div>
            <Link href="/content">
              <Button className="w-full">
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Flashcards Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="secondary">
                {flashcardsProgress}% studied
              </Badge>
            </div>
            <CardTitle className="mt-4">Flashcards</CardTitle>
            <CardDescription>
              Review and memorize key concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={flashcardsProgress} className="h-2 mb-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Brain className="h-4 w-4" />
              <span>
                {stats?.flashcardsTotal && stats?.flashcardsStudied
                  ? stats.flashcardsTotal - stats.flashcardsStudied
                  : 0}{' '}
                cards to review
              </span>
            </div>
            <Link href="/flashcards">
              <Button className="w-full" variant="outline">
                Study Flashcards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tests Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary">
                {testsProgress}% complete
              </Badge>
            </div>
            <CardTitle className="mt-4">Practice Tests</CardTitle>
            <CardDescription>
              Test your knowledge with timed quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={testsProgress} className="h-2 mb-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <ClipboardCheck className="h-4 w-4" />
              <span>
                {stats?.testsTotal && stats?.testsCompleted
                  ? stats.testsTotal - stats.testsCompleted
                  : 0}{' '}
                tests available
              </span>
            </div>
            <Link href="/tests">
              <Button className="w-full" variant="outline">
                Take a Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
