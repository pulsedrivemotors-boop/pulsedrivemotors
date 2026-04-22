"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Globe, EyeOff } from 'lucide-react'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Post deleted'); load() }
    else showToast('Delete failed', 'error')
  }

  const togglePublished = async (post: any) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published: !post.published }),
    })
    load()
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-lime-500 text-black' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 text-sm">{posts.length} total posts</p>
        </div>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No blog posts yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Title</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Published</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-gray-500 text-xs">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-300 text-xs">{post.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(post)}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-colors ${post.published ? 'bg-lime-500/20 text-lime-400 border-lime-500/30 hover:bg-lime-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30'}`}>
                        {post.published ? <Globe size={12} /> : <EyeOff size={12} />}
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-500 text-xs">{formatDate(post.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-lime-500/20 text-gray-400 hover:text-lime-400 rounded-lg transition-colors">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)}
                          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
