"use client"
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Plus, X, Monitor, GripVertical } from 'lucide-react'


const MAX_PHOTOS = 20

declare global {
  interface Window {
    Dropbox: {
      choose: (options: {
        success: (files: Array<{ link: string; name: string }>) => void
        cancel?: () => void
        linkType: 'direct' | 'preview'
        multiselect: boolean
        extensions: string[]
      }) => void
    }
  }
}

interface PhotoUploaderProps {
  photos: string[]
  onChange: (photos: string[]) => void
}

interface UploadingFile {
  id: string
  name: string
  progress: 'uploading' | 'error'
  error?: string
}

export default function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [dropboxLoaded, setDropboxLoaded] = useState(false)

  // Drag-to-reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load Dropbox Chooser SDK
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_DROPBOX_APP_KEY) return
    if (document.getElementById('dropbox-sdk')) { setDropboxLoaded(true); return }
    const script = document.createElement('script')
    script.id = 'dropbox-sdk'
    script.src = 'https://www.dropbox.com/static/api/2/dropins.js'
    script.setAttribute('data-app-key', process.env.NEXT_PUBLIC_DROPBOX_APP_KEY)
    script.onload = () => setDropboxLoaded(true)
    document.head.appendChild(script)
  }, [])

  const slotsLeft = MAX_PHOTOS - photos.length

  const uploadFiles = useCallback(async (files: File[]) => {
    const eligible = files
      .filter(f => f.type.startsWith('image/'))
      .slice(0, slotsLeft)

    if (eligible.length === 0) return
    setErrorMsg('')

    const batch: UploadingFile[] = eligible.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      progress: 'uploading',
    }))
    setUploading(prev => [...prev, ...batch])

    const results = await Promise.all(
      eligible.map(async (file, idx) => {
        if (file.size > 10 * 1024 * 1024) {
          return { id: batch[idx].id, error: `${file.name}: too large (max 10MB)` }
        }
        const form = new FormData()
        form.append('file', file)
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
          const data = await res.json()
          if (!res.ok) return { id: batch[idx].id, error: data.error || 'Upload failed' }
          return { id: batch[idx].id, url: data.url as string }
        } catch {
          return { id: batch[idx].id, error: 'Network error' }
        }
      })
    )

    const uploaded = results.filter(r => r.url).map(r => r.url as string)
    const errors = results.filter(r => r.error).map(r => r.error as string)

    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded])
    }
    if (errors.length > 0) {
      setErrorMsg(errors.join(', '))
    }

    setUploading(prev => prev.filter(u => !batch.find(b => b.id === u.id)))

    if (uploaded.length > 0 && errors.length === 0) {
      setModalOpen(false)
    }
  }, [photos, onChange, slotsLeft])

  const handleModalDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDropZoneActive(false)
    uploadFiles(Array.from(e.dataTransfer.files))
  }, [uploadFiles])

  const handleDropbox = () => {
    if (!window.Dropbox) return
    const remaining = slotsLeft
    window.Dropbox.choose({
      success: (files) => {
        const urls = files.slice(0, remaining).map(f => f.link)
        onChange([...photos, ...urls])
        setModalOpen(false)
      },
      linkType: 'direct',
      multiselect: true,
      extensions: ['images'],
    })
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  // Drag-to-reorder handlers
  const onDragStart = (index: number) => {
    setDragIndex(index)
  }

  const onDragEnter = (index: number) => {
    setDragOverIndex(index)
  }

  const onDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const next = [...photos]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(dragOverIndex, 0, moved)
      onChange(next)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const isUploading = uploading.length > 0

  return (
    <div>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-2">
        {photos.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragEnd={onDragEnd}
            onDragOver={e => e.preventDefault()}
            className={`relative group aspect-video bg-gray-800 rounded-lg overflow-hidden border transition-all cursor-grab active:cursor-grabbing select-none ${
              dragOverIndex === i && dragIndex !== i
                ? 'border-lime-500 scale-105'
                : dragIndex === i
                ? 'border-white/30 opacity-50'
                : 'border-white/10'
            }`}
          >
            <Image src={url} alt="" fill className="object-cover pointer-events-none" sizes="200px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />

            {/* Cover badge */}
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-lime-500 text-black px-1.5 py-0.5 rounded z-10">
                COVER
              </span>
            )}

            {/* Drag handle */}
            <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <GripVertical size={14} className="text-white/70" />
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Trash2 size={11} className="text-white" />
            </button>
          </div>
        ))}

        {/* Upload progress placeholders */}
        {uploading.map(u => (
          <div key={u.id} className="aspect-video bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-1.5">
            <div className="w-5 h-5 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 text-[10px] truncate max-w-full px-2">{u.name}</span>
          </div>
        ))}

        {/* Add button — only show if under limit */}
        {photos.length < MAX_PHOTOS && !isUploading && (
          <button
            type="button"
            onClick={() => { setModalOpen(true); setErrorMsg('') }}
            className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-lime-500/50 hover:bg-lime-500/5 transition-colors cursor-pointer"
          >
            <Plus size={20} className="text-gray-500" />
            <span className="text-gray-500 text-xs">Add Photo</span>
          </button>
        )}
      </div>

      {/* Status line */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-600 text-xs">
          {photos.length > 0
            ? `${photos.length}/${MAX_PHOTOS} photos · First photo is the cover · Drag to reorder`
            : `Up to ${MAX_PHOTOS} photos`}
        </p>
        {photos.length >= MAX_PHOTOS && (
          <p className="text-yellow-500 text-xs">Maximum {MAX_PHOTOS} photos reached</p>
        )}
      </div>

      {errorMsg && (
        <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-lg">Add Photos</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-500 text-xs mb-5">
              {slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} remaining · You can select multiple files at once
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDropZoneActive(true) }}
              onDragLeave={() => setDropZoneActive(false)}
              onDrop={handleModalDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 mb-4 text-center transition-colors ${
                dropZoneActive
                  ? 'border-lime-500 bg-lime-500/10'
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <Upload size={32} className={`mx-auto mb-3 ${dropZoneActive ? 'text-lime-400' : 'text-gray-600'}`} />
              <p className="text-white font-medium mb-1">Drag & Drop</p>
              <p className="text-gray-500 text-sm">Drop multiple photos here</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-colors"
              >
                <Monitor size={22} className="text-lime-400" />
                <span className="text-white text-sm font-medium">From Computer</span>
                <span className="text-gray-500 text-xs">Select multiple files</span>
              </button>

              <button
                type="button"
                disabled={!dropboxLoaded && !!process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}
                onClick={handleDropbox}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-[#0061FF]/10 border border-white/10 hover:border-[#0061FF]/40 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
                  <path d="M12 6L24 14L12 22L0 14L12 6Z" fill="#0061FF"/>
                  <path d="M36 6L48 14L36 22L24 14L36 6Z" fill="#0061FF"/>
                  <path d="M0 28L12 20L24 28L12 36L0 28Z" fill="#0061FF"/>
                  <path d="M24 28L36 20L48 28L36 36L24 28Z" fill="#0061FF"/>
                  <path d="M12 38L24 30L36 38L24 46L12 38Z" fill="#0061FF"/>
                </svg>
                <span className="text-white text-sm font-medium">Dropbox</span>
                <span className="text-gray-500 text-xs">
                  {!process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ? 'Not configured' : dropboxLoaded ? 'Choose files' : 'Loading...'}
                </span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                uploadFiles(Array.from(e.target.files ?? []))
                e.target.value = ''
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
