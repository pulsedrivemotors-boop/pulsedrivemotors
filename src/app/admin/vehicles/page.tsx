"use client"
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Star, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  reserved: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  sold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const res = await fetch(`/api/admin/vehicles?${params}`)
    const data = await res.json()
    setVehicles(data.vehicles || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, status])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Vehicle deleted'); load() }
    else showToast('Delete failed', 'error')
  }

  const toggleFeatured = async (v: any) => {
    await fetch(`/api/admin/vehicles/${v.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...v, featured: !v.featured }) })
    load()
  }

  const changeStatus = async (v: any, newStatus: string) => {
    const res = await fetch(`/api/admin/vehicles/${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...v, status: newStatus }),
    })
    if (res.ok) { showToast(`Marked as ${newStatus}`); load() }
    else showToast('Failed to update status', 'error')
  }

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-lime-500 text-black' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicles</h1>
          <p className="text-gray-400 text-sm">{total} total vehicles</p>
        </div>
        <Link href="/admin/vehicles/new"
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Vehicle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search make, model, VIN..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:border-lime-500 focus:outline-none" />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:border-lime-500 focus:outline-none">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No vehicles found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Vehicle</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">VIN</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Price</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Featured</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {v.photos?.[0] && <Image src={v.photos[0]} alt="" width={48} height={36} unoptimized={v.photos[0].startsWith('/uploads/')} className="object-cover w-full h-full" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{v.year} {v.make} {v.model}</p>
                          <p className="text-gray-500 text-xs">{v.trim}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <code className="text-gray-400 text-xs">{v.vin}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lime-400 font-medium">${v.price.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusDropdown
                        vehicle={v}
                        onChangeStatus={(newStatus) => changeStatus(v, newStatus)}
                      />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button onClick={() => toggleFeatured(v)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${v.featured ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'border-white/20 text-gray-600 hover:text-gray-400'}`}>
                        <Star size={12} className={v.featured ? 'fill-current' : ''} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/vehicles/${v.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-lime-500/20 text-gray-400 hover:text-lime-400 rounded-lg transition-colors">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => handleDelete(v.id, `${v.year} ${v.make} ${v.model}`)}
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-gray-400 text-sm">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center bg-white/10 text-gray-400 rounded-lg disabled:opacity-40 hover:bg-white/15 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-8 h-8 flex items-center justify-center bg-white/10 text-gray-400 rounded-lg disabled:opacity-40 hover:bg-white/15 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Status dropdown component ────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'available', label: 'Available', style: 'bg-lime-500/20 text-lime-400 border-lime-500/30' },
  { value: 'reserved',  label: 'Reserved',  style: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'sold',      label: 'Sold',      style: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
]

function StatusDropdown({ vehicle, onChangeStatus }: { vehicle: any; onChangeStatus: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = STATUS_OPTIONS.find(o => o.value === vehicle.status) ?? STATUS_OPTIONS[0]

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors hover:opacity-80 ${current.style}`}
      >
        {current.label}
        <ChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-32 bg-gray-900 border border-white/15 rounded-lg shadow-xl overflow-hidden">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChangeStatus(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 flex items-center gap-2 ${
                opt.value === vehicle.status ? 'opacity-40 cursor-default' : ''
              } ${opt.style.includes('lime') ? 'text-lime-400' : opt.style.includes('yellow') ? 'text-yellow-400' : 'text-gray-400'}`}
              disabled={opt.value === vehicle.status}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                opt.value === 'available' ? 'bg-lime-400' :
                opt.value === 'reserved'  ? 'bg-yellow-400' : 'bg-gray-400'
              }`} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
