"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError('Invalid email or password')
    else { router.push('/admin'); router.refresh() }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="48" height="28" viewBox="0 0 200 60" fill="none">
              <polyline points="0,30 30,30 45,8 55,52 65,15 75,45 85,30 200,30" fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">PULSE DRIVE MOTORS</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@pulsedrive.ca"
                  className="w-full bg-black border border-white/20 text-white rounded-lg pl-9 pr-3 py-3 text-sm focus:border-lime-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/20 text-white rounded-lg pl-9 pr-10 py-3 text-sm focus:border-lime-500 focus:outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-lime-500 hover:bg-lime-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-4">
            Default: admin@pulsedrive.ca / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
