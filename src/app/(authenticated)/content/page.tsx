'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { VideoPlayer } from '@/components/course/VideoPlayer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl: string | null
  duration: number | null
  order: number
  isCompleted: boolean
}

// Mock data - will be replaced with API calls
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to the Course',
    content: `
# Welcome to the Course

This is the introductory lesson where you'll learn the fundamentals of the subject.

## What You'll Learn

- Key concepts and terminology
- Basic principles and theories
- Practical applications

## Getting Started

Before we dive in, make sure you have:

1. A notebook for taking notes
2. Access to the course materials
3. Time set aside for focused learning

> "The beautiful thing about learning is that no one can take it away from you." - B.B. King

### Key Terms

| Term | Definition |
|------|------------|
| Concept A | The foundational principle |
| Concept B | Building on Concept A |
| Concept C | Advanced application |

Let's begin your learning journey!
    `,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 15,
    order: 1,
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Core Concepts',
    content: `
# Core Concepts

In this lesson, we'll explore the fundamental concepts that form the basis of our subject.

## The Foundation

Understanding these core concepts is essential for mastering the material.

### Concept 1: Basic Principles

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Concept 2: Building Blocks

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Practice Exercise

Try applying these concepts to a real-world scenario:

\`\`\`javascript
// Example code snippet
function demonstrateConcept() {
  const principle = "understanding";
  return principle + " leads to mastery";
}
\`\`\`
    `,
    videoUrl: null,
    duration: 20,
    order: 2,
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Advanced Topics',
    content: `
# Advanced Topics

Now that you understand the basics, let's dive deeper into more advanced material.

## Complex Scenarios

We'll explore how to apply your knowledge in complex, real-world situations.

- Scenario analysis
- Problem-solving strategies
- Best practices

## Summary

Key takeaways from this lesson:

1. Build on your foundational knowledge
2. Practice regularly
3. Apply concepts to real situations
    `,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 25,
    order: 3,
    isCompleted: false,
  },
]

export default function ContentPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    let cancelled = false

    async function loadLessons() {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!cancelled) {
        setLessons(mockLessons)
        setSelectedLesson(mockLessons[0])
        setIsLoading(false)
      }
    }

    loadLessons()

    return () => {
      cancelled = true
    }
  }, [])

  const markAsComplete = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
      )
    )
  }

  const completedCount = lessons.filter((l) => l.isCompleted).length
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Course Content
        </h1>
        <p className="text-muted-foreground mt-1">
          {completedCount} of {lessons.length} lessons completed ({Math.round(progress)}%)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar - Lesson List */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg mb-4">Lessons</h2>
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedLesson?.id === lesson.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                      lesson.isCompleted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      lesson.order
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {lesson.videoUrl && (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                      {lesson.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        {selectedLesson ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      {selectedLesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedLesson.duration} min
                        </span>
                      )}
                      {selectedLesson.videoUrl && (
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Includes video
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {!selectedLesson.isCompleted && (
                    <Button onClick={() => markAsComplete(selectedLesson.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                  {selectedLesson.isCompleted && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {selectedLesson.videoUrl && (
                <CardContent className="pt-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">
                        <FileText className="h-4 w-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="video">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Video
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-0">
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selectedLesson.content}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>

                    <TabsContent value="video" className="mt-0">
                      <VideoPlayer
                        url={selectedLesson.videoUrl!}
                        title={selectedLesson.title}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}

              {!selectedLesson.videoUrl && (
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedLesson.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = lessons.findIndex(
                    (l) => l.id === selectedLesson.id
                  )
                  if (currentIndex > 0) {
                    setSelectedLesson(lessons[currentIndex - 1])
                  }
                }}
                disabled={lessons.findIndex((l) => l.id === selectedLesson.id) === 0}
              >
                Previous Lesson
              </Button>
              <Button
                onClick={() => {
                  const currentIndex = lessons.findIndex(
                    (l) => l.id === selectedLesson.id
                  )
                  if (currentIndex < lessons.length - 1) {
                    setSelectedLesson(lessons[currentIndex + 1])
                  }
                }}
                disabled={
                  lessons.findIndex((l) => l.id === selectedLesson.id) ===
                  lessons.length - 1
                }
              >
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="flex items-center justify-center h-96">
            <CardContent className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a lesson from the sidebar to begin
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
