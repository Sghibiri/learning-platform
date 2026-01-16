'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FlashCardProps {
  front: string
  back: string
  className?: string
}

export function FlashCard({ front, back, className }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleFlip()
    }
  }

  return (
    <div
      className={cn(
        'perspective-1000 w-full max-w-lg mx-auto cursor-pointer',
        className
      )}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Show question' : 'Show answer'}
    >
      <div
        className={cn(
          'relative w-full aspect-[3/2] transition-transform duration-500 transform-style-3d',
          isFlipped && 'rotate-y-180'
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden',
            'bg-gradient-to-br from-primary/5 to-primary/10',
            'border-2 border-primary/20 rounded-xl',
            'flex flex-col items-center justify-center p-8',
            'shadow-lg hover:shadow-xl transition-shadow'
          )}
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Question
          </span>
          <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">
            {front}
          </p>
          <span className="text-xs text-muted-foreground mt-6">
            Click to flip
          </span>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180',
            'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30',
            'border-2 border-green-200 dark:border-green-800 rounded-xl',
            'flex flex-col items-center justify-center p-8',
            'shadow-lg hover:shadow-xl transition-shadow'
          )}
        >
          <span className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 mb-4">
            Answer
          </span>
          <p className="text-xl md:text-2xl font-medium text-center leading-relaxed text-green-900 dark:text-green-100">
            {back}
          </p>
          <span className="text-xs text-green-600/60 dark:text-green-400/60 mt-6">
            Click to flip back
          </span>
        </div>
      </div>
    </div>
  )
}
