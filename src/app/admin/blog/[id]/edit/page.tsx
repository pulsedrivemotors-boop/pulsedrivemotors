"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'

export default function EditBlogPostPage() {
  const params = useParams()
  const id = params.id as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => { if (data) { setPost(data); setLoading(false) } })
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="p-8 text-center text-gray-400">Post not found</div>
  )

  return <BlogForm mode="edit" initialData={post} />
}
