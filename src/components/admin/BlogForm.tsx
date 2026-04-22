"use client"
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogFormData {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  image: string
  published: boolean
}

const defaultData: BlogFormData = {
  title: '', slug: '', category: 'General',
  excerpt: '', content: '', image: '', published: false,
}

const CATEGORIES = ['Buying Guides', 'Finance', 'Comparisons', 'Maintenance', 'Local News', 'General']

interface Props {
  initialData?: Partial<BlogFormData> & { id?: string }
  mode: 'new' | 'edit'
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Cover Image Uploader ─────────────────────────────────────────────────────
interface CoverUploaderProps {
  value: string
  onChange: (url: string) => void
}

function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large (max 10MB)')
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ''
  }

  return (
    <div>
      {value ? (
        // ── Preview ──────────────────────────────────────────────────────────
        <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-white/10 group">
          <div className="relative h-52 w-full">
            <Image
              src={value}
              alt="Cover preview"
              fill
              className="object-cover"
              sizes="600px"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-black/80 hover:bg-lime-500 text-white hover:text-black text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 bg-black/80 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={12} /> Remove
            </button>
          </div>

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 size={28} className="text-lime-400 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        // ── Drop zone ─────────────────────────────────────────────────────────
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            dragOver
              ? 'border-lime-500 bg-lime-500/10'
              : 'border-white/20 bg-black/20 hover:border-lime-500/50 hover:bg-lime-500/5'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-lime-400 animate-spin" />
              <p className="text-gray-400 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <ImageIcon size={22} className={dragOver ? 'text-lime-400' : 'text-gray-500'} />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium">
                  {dragOver ? 'Drop to upload' : 'Upload cover image'}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Drag & drop or <span className="text-lime-400">click to browse</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP · max 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
          <X size={12} /> {uploadError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

// ── Main Form ────────────────────────────────────────────────────────────────
export default function BlogForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<BlogFormData>({ ...defaultData, ...initialData })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (field: keyof BlogFormData, value: any) => setForm(f => ({ ...f, [field]: value }))

  const handleTitleChange = (title: string) => {
    set('title', title)
    if (mode === 'new') set('slug', slugify(title))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const url = mode === 'new' ? '/api/admin/blog' : `/api/admin/blog/${(initialData as any).id}`
    const method = mode === 'new' ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save post')
      return
    }
    setSuccess(mode === 'new' ? 'Post created successfully!' : 'Post updated successfully!')
    setTimeout(() => router.push('/admin/blog'), 1000)
  }

  const inputClass = "w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
  const labelClass = "text-gray-400 text-xs mb-1.5 block"

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/15 text-gray-400 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{mode === 'new' ? 'New Blog Post' : 'Edit Blog Post'}</h1>
          <p className="text-gray-400 text-sm">{mode === 'new' ? 'Create a new article' : 'Update post content'}</p>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-lime-500/10 border border-lime-500/30 text-lime-400 text-sm px-4 py-3 rounded-lg mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Post Details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input required value={form.title} onChange={e => handleTitleChange(e.target.value)}
                className={inputClass} placeholder="e.g. Top 5 SUVs for Canadian Winters" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input required value={form.slug} onChange={e => set('slug', e.target.value)}
                className={inputClass} placeholder="top-5-suvs-canadian-winters" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label className={labelClass}>Cover Image</label>
              <CoverUploader value={form.image} onChange={(url) => set('image', url)} />
            </div>

            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                className={`${inputClass} resize-none`} placeholder="Brief description shown in listings..." />
            </div>
            <div>
              <label className={labelClass}>Content</label>
              <textarea rows={14} value={form.content} onChange={e => set('content', e.target.value)}
                className={`${inputClass} resize-none`} placeholder={`Full article content...\n\nTips:\n# Big heading\n## Section heading\n- Bullet point\n\nSeparate paragraphs with a blank line.`} />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
                  className="w-4 h-4 accent-lime-500" />
                <span className="text-white text-sm">Publish immediately</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-60 text-black font-bold px-6 py-3 rounded-xl transition-colors">
            <Save size={16} />
            {loading ? 'Saving...' : mode === 'new' ? 'Create Post' : 'Save Changes'}
          </button>
          <Link href="/admin/blog" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
