"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Search } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  negotiation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/leads?${params}`)
    const data = await res.json()
    setLeads(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter])

  const filtered = leads.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q) || l.vehicleInterest?.toLowerCase().includes(q)
  })

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-400 text-sm">{filtered.length} leads</p>
        </div>
        <div className="flex items-center gap-2 text-lime-400">
          <Users size={20} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search name, email, phone..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:border-lime-500 focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:border-lime-500 focus:outline-none">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed">Closed</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Name</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Vehicle Interest</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Source</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="block">
                        <p className="text-white font-medium hover:text-lime-400 transition-colors">{lead.name}</p>
                        <p className="text-gray-500 text-xs">{lead.message?.slice(0, 40)}{lead.message?.length > 40 ? '...' : ''}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-300 text-xs">{lead.phone}</p>
                      <p className="text-gray-500 text-xs">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-300 text-xs">{lead.vehicleInterest || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs capitalize">{lead.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-500 text-xs">{formatDate(lead.createdAt)}</span>
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
