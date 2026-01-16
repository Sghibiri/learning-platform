'use client'

import { useState, useEffect, useCallback } from 'react'
import { FlashCard } from '@/components/flashcards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Brain,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface Flashcard {
  id: string
  front: string
  back: string
  category: string | null
}

// Mock data - will be replaced with API calls
const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'What is the capital of France?',
    back: 'Paris',
    category: 'Geography',
  },
  {
    id: '2',
    front: 'What is the chemical symbol for water?',
    back: 'H₂O',
    category: 'Chemistry',
  },
  {
    id: '3',
    front: 'Who wrote "Romeo and Juliet"?',
    back: 'William Shakespeare',
    category: 'Literature',
  },
  {
    id: '4',
    front: 'What is the powerhouse of the cell?',
    back: 'Mitochondria',
    category: 'Biology',
  },
  {
    id: '5',
    front: 'What year did World War II end?',
    back: '1945',
    category: 'History',
  },
  {
    id: '6',
    front: 'What is the speed of light?',
    back: '299,792,458 meters per second',
    category: 'Physics',
  },
]

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    let cancelled = false

    async function loadFlashcards() {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!cancelled) {
        setFlashcards(mockFlashcards)
        setIsLoading(false)
      }
    }

    loadFlashcards()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredCards = selectedCategory === 'all'
    ? flashcards
    : flashcards.filter((card) => card.category === selectedCategory)

  const categories = Array.from(
    new Set(flashcards.map((card) => card.category).filter(Boolean))
  ) as string[]

  const currentCard = filteredCards[currentIndex]
  const progress = filteredCards.length > 0
    ? ((currentIndex + 1) / filteredCards.length) * 100
    : 0

  const goToNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, filteredCards.length])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setFlashcards((prev) =>
      prev.map((card) => {
        const shuffledCard = shuffled.find((s) => s.id === card.id)
        return shuffledCard || card
      })
    )
    setCurrentIndex(0)
  }

  const resetProgress = () => {
    setKnownCards(new Set())
    setUnknownCards(new Set())
    setCurrentIndex(0)
  }

  const markAsKnown = () => {
    if (currentCard) {
      setKnownCards((prev) => new Set([...prev, currentCard.id]))
      setUnknownCards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(currentCard.id)
        return newSet
      })
      goToNext()
    }
  }

  const markAsUnknown = () => {
    if (currentCard) {
      setUnknownCards((prev) => new Set([...prev, currentCard.id]))
      setKnownCards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(currentCard.id)
        return newSet
      })
      goToNext()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <div className="flex justify-center mt-12">
            <Skeleton className="h-64 w-full max-w-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Flashcards
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and memorize key concepts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value)
            setCurrentIndex(0)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <Badge variant="secondary">{filteredCards.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 dark:text-green-400">Known</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {knownCards.size}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600 dark:text-orange-400">Review</span>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {unknownCards.size}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredCards.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No flashcards available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no flashcards in this category yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>
                {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Flashcard */}
          <div className="mb-8">
            {currentCard && (
              <FlashCard front={currentCard.front} back={currentCard.back} />
            )}
          </div>

          {/* Category Badge */}
          {currentCard?.category && (
            <div className="flex justify-center mb-6">
              <Badge variant="outline">{currentCard.category}</Badge>
            </div>
          )}

          {/* Know/Don't Know Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={markAsUnknown}
              className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              <XCircle className="mr-2 h-5 w-5" />
              Need Review
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={markAsKnown}
              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Got It!
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button variant="outline" onClick={shuffleCards}>
              <Shuffle className="mr-2 h-4 w-4" />
              Shuffle
            </Button>

            <Button variant="outline" onClick={resetProgress}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex === filteredCards.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Use arrow keys to navigate between cards
          </p>
        </>
      )}
    </div>
  )
}
