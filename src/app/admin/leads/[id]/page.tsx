"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Clock, User, Phone, Mail, Car } from 'lucide-react'

const STATUS_OPTIONS = ['new', 'contacted', 'negotiation', 'closed', 'lost']
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  negotiation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function LeadDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusValue, setStatusValue] = useState('')
  const [statusSaving, setStatusSaving] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadLead = async () => {
    const res = await fetch(`/api/admin/leads/${id}`)
    const data = await res.json()
    setLead(data)
    setStatusValue(data.status)
    setLoading(false)
  }

  useEffect(() => { loadLead() }, [id])

  const saveStatus = async () => {
    setStatusSaving(true)
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusValue }),
    })
    setStatusSaving(false)
    showToast('Status updated')
    loadLead()
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setNoteSaving(true)
    await fetch(`/api/admin/leads/${id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    setNote('')
    setNoteSaving(false)
    showToast('Note added')
    loadLead()
  }

  const formatDate = (d: string) => new Date(d).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!lead) return <div className="p-8 text-center text-gray-400">Lead not found</div>

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium bg-lime-500 text-black">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/leads" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/15 text-gray-400 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
              {lead.status}
            </span>
            <span className="text-gray-500 text-xs">Source: {lead.source}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info */}
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={16} className="text-lime-400" /> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.phone && (
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Phone</p>
                    <p className="text-white text-sm">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="text-white text-sm">{lead.email}</p>
                  </div>
                </div>
              )}
              {lead.vehicleInterest && (
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                  <Car size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Vehicle Interest</p>
                    <p className="text-white text-sm">{lead.vehicleInterest}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Created</p>
                  <p className="text-white text-sm">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
            </div>
            {lead.message && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Message</p>
                <p className="text-gray-200 text-sm">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Add Activity */}
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-lime-400" /> Add Activity Note
            </h2>
            <form onSubmit={addNote} className="space-y-3">
              <textarea
                value={note} onChange={e => setNote(e.target.value)}
                rows={3} placeholder="Log a call, meeting, or note..."
                className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none resize-none"
              />
              <button type="submit" disabled={noteSaving || !note.trim()}
                className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                <MessageSquare size={14} />
                {noteSaving ? 'Adding...' : 'Add Note'}
              </button>
            </form>
          </div>

          {/* Activity Timeline */}
          {lead.activities?.length > 0 && (
            <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-lime-400" /> Activity Timeline
              </h2>
              <div className="space-y-3">
                {lead.activities.map((activity: any) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-lime-500 rounded-full mt-2" />
                    <div className="flex-1 pb-3 border-b border-white/5 last:border-0">
                      <p className="text-gray-200 text-sm">{activity.note}</p>
                      <p className="text-gray-500 text-xs mt-1">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Status */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Update Status</h2>
            <div className="space-y-2 mb-4">
              {STATUS_OPTIONS.map(s => (
                <label key={s} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${statusValue === s ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <input type="radio" name="status" value={s} checked={statusValue === s} onChange={() => setStatusValue(s)}
                    className="accent-lime-500" />
                  <span className={`text-sm capitalize ${STATUS_COLORS[s]?.includes('text-') ? STATUS_COLORS[s].split(' ').find(c => c.startsWith('text-')) : 'text-gray-300'}`}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
            <button onClick={saveStatus} disabled={statusSaving || statusValue === lead.status}
              className="w-full bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold py-2 rounded-lg text-sm transition-colors">
              {statusSaving ? 'Saving...' : 'Save Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
