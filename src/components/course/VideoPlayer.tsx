'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title?: string
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

export function VideoPlayer({ url, title = 'Video' }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const youtubeId = getYouTubeVideoId(url)
  const vimeoId = getVimeoVideoId(url)

  if (youtubeId) {
    return (
      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </div>
    )
  }

  // Fallback for other video URLs (direct MP4, etc.)
  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      <video
        src={url}
        controls
        className="absolute inset-0 w-full h-full"
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      >
        Your browser does not support the video tag.
      </video>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Unable to load video</p>
          </div>
        </div>
      )}
    </div>
  )
}
