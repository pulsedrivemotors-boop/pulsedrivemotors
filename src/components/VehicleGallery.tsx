"use client"
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  photos: string[]
  alt: string
  status: string
}

export default function VehicleGallery({ photos, alt, status }: Props) {
  const [active, setActive] = useState(0)

  const prev = useCallback(() => setActive(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setActive(i => (i + 1) % photos.length), [photos.length])

  if (!photos.length) return null

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-72 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-900 group">
        <Image
          key={active}
          src={photos[active]}
          alt={`${alt} — photo ${active + 1}`}
          fill
          className="object-cover"
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 66vw"
        />

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${status === 'new' ? 'bg-lime-500 text-black' : 'bg-gray-900/80 text-lime-400 border border-lime-500/40'}`}>
            {status === 'new' ? 'NEW' : 'USED'}
          </span>
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {active + 1} / {photos.length}
        </div>

        {/* Arrows — only when multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-lime-500' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Image src={photo} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
