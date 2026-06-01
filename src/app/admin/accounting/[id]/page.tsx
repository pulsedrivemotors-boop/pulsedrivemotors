"use client"
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, DollarSign, Save } from 'lucide-react'
import { STATUS_BADGE, STATUS_LABEL } from '@/lib/vehicleStatus'

const CATEGORIES = ['Purchase', 'Parts', 'Repair', 'Transport', 'Detailing', 'Advertising', 'Inspection', 'Other']

function fmt(n: number | null) {
  if (n === null || n === undefined) return '—'
  const abs = Math.abs(n)
  const s = `$${abs.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  return n < 0 ? `-${s}` : s
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AccountingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Form state for new cost
  const [form, setForm] = useState({ category: 'Parts', description: '', amount: '', date: new Date().toISOString().slice(0, 10) })

  // Purchase / sold price editing
  const [purchaseInput, setPurchaseInput] = useState('')
  const [soldInput, setSoldInput] = useState('')
  const [purchaseDateInput, setPurchaseDateInput] = useState('')
  const [soldDateInput, setSoldDateInput] = useState('')
  const [soldChecked, setSoldChecked] = useState(false) // mirrors status === 'sold'

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = () => {
    setLoading(true)
    fetch(`/api/admin/accounting/vehicle/${id}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setPurchaseInput(d.vehicle.purchasePrice > 0 ? String(d.vehicle.purchasePrice) : '')
        setSoldInput(d.vehicle.soldPrice !== null ? String(d.vehicle.soldPrice) : '')
        setPurchaseDateInput(d.vehicle.purchaseDate ? d.vehicle.purchaseDate.slice(0, 10) : '')
        setSoldDateInput(d.vehicle.soldDate ? d.vehicle.soldDate.slice(0, 10) : '')
        setSoldChecked(d.vehicle.status === 'sold')
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [id])

  const savePrices = async () => {
    setSaving(true)
    // Sold checkbox drives the site-wide status: checked → 'sold';
    // unchecked while currently sold → revert to 'available'; otherwise unchanged.
    const currentStatus = data.vehicle.status
    const status = soldChecked ? 'sold' : (currentStatus === 'sold' ? 'available' : currentStatus)
    const res = await fetch(`/api/admin/accounting/vehicle/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchasePrice: purchaseInput,
        soldPrice: soldInput,
        purchaseDate: purchaseDateInput,
        soldDate: soldDateInput,
        status,
      }),
    })
    setSaving(false)
    if (res.ok) { showToast(soldChecked ? 'Saved — marked as Sold' : 'Saved'); load() }
    else showToast('Failed to save', false)
  }

  const addCost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || isNaN(parseFloat(form.amount))) return
    const res = await fetch('/api/admin/accounting/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId: id, ...form }),
    })
    if (res.ok) {
      setForm({ category: 'Parts', description: '', amount: '', date: new Date().toISOString().slice(0, 10) })
      showToast('Cost added')
      load()
    } else showToast('Failed to add cost', false)
  }

  const deleteCost = async (costId: string) => {
    if (!confirm('Delete this cost entry?')) return
    const res = await fetch(`/api/admin/accounting/costs/${costId}`, { method: 'DELETE' })
    if (res.ok) { showToast('Deleted'); load() }
    else showToast('Failed to delete', false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { vehicle, costs, summary } = data
  const profitPositive = summary.profit !== null && summary.profit >= 0

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${toast.ok ? 'bg-lime-500 text-black' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link href="/admin/accounting" className="mt-1 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-lg text-gray-400 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim && <span className="text-gray-400 font-normal text-lg ml-2">{vehicle.trim}</span>}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_BADGE[vehicle.status] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {STATUS_LABEL[vehicle.status] ?? vehicle.status}
            </span>
            <p className="text-gray-500 text-sm">VIN: {vehicle.vin}</p>
          </div>
        </div>
      </div>

      {/* P&L Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <SummaryCard label="Purchase Price" value={summary.purchasePrice > 0 ? fmt(summary.purchasePrice) : '—'} color="text-white" />
        <SummaryCard label="All Expenses" value={summary.totalCosts > 0 ? fmt(summary.totalCosts) : '—'} color="text-yellow-400" />
        <SummaryCard label="Total Invested" value={summary.totalInvested > 0 ? fmt(summary.totalInvested) : '—'} color="text-blue-400" />
        {summary.profit !== null
          ? <SummaryCard
              label="Profit"
              value={`${profitPositive ? '+' : ''}${fmt(summary.profit)}`}
              sub={summary.profitPct !== null ? `${summary.profitPct >= 0 ? '+' : ''}${summary.profitPct.toFixed(1)}% margin` : undefined}
              color={profitPositive ? 'text-lime-400' : 'text-red-400'}
            />
          : <SummaryCard label="Profit" value="Not sold" color="text-gray-500" />
        }
      </div>

      {/* Purchase & Sale prices form */}
      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-lime-500" /> Purchase & Sale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Purchase Price (what you paid)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number" min="0" step="100"
                value={purchaseInput}
                onChange={e => setPurchaseInput(e.target.value)}
                placeholder="0"
                className="w-full bg-black border border-white/20 text-white rounded-lg pl-7 pr-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Purchase Date</label>
            <input
              type="date"
              value={purchaseDateInput}
              onChange={e => setPurchaseDateInput(e.target.value)}
              className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Sale Price (actual sold for)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number" min="0" step="100"
                value={soldInput}
                onChange={e => setSoldInput(e.target.value)}
                placeholder="Not sold yet"
                className="w-full bg-black border border-white/20 text-white rounded-lg pl-7 pr-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Sale Date</label>
            <input
              type="date"
              value={soldDateInput}
              onChange={e => setSoldDateInput(e.target.value)}
              className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
            />
          </div>
        </div>
        {/* Sold toggle — changes the vehicle status across the whole site */}
        <label className="mt-5 flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={soldChecked}
            onChange={e => {
              const checked = e.target.checked
              setSoldChecked(checked)
              // Default the sale date to today when marking sold and none is set yet
              if (checked && !soldDateInput) setSoldDateInput(new Date().toISOString().slice(0, 10))
            }}
            className="mt-0.5 w-4 h-4 accent-lime-500"
          />
          <span>
            <span className="text-white text-sm font-medium">Sold</span>
            <span className="block text-gray-500 text-xs">
              Marks this vehicle as <b>Sold</b> everywhere on the site (inventory, public pages). Unchecking reverts it to Available.
            </span>
          </span>
        </label>

        <button onClick={savePrices} disabled={saving}
          className="mt-4 flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {summary.daysToSell !== null && (
          <p className="mt-3 text-sm text-gray-400">
            Time from purchase to sale: <span className="text-lime-400 font-semibold">{summary.daysToSell} {summary.daysToSell === 1 ? 'day' : 'days'}</span>
          </p>
        )}
      </div>

      {/* Add cost form */}
      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-lime-500" /> Add Expense
        </h2>
        <form onSubmit={addCost} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. New brake pads"
              className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Amount ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" min="0" step="0.01" required value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-black border border-white/20 text-white rounded-lg pl-7 pr-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
          </div>
          <div className="md:col-span-4">
            <button type="submit"
              className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold px-5 py-2 rounded-lg text-sm transition-colors">
              <Plus size={14} /> Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Cost list */}
      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-semibold">Expense History</h2>
          {costs.length > 0 && (
            <span className="text-lime-400 font-bold text-sm">Total: {fmt(summary.totalCosts)}</span>
          )}
        </div>

        {costs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No expenses yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-medium px-4 py-3">Date</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Category</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Description</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Amount</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {costs.map((c: any) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(c.date)}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge cat={c.category} />
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.description || '—'}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{fmt(c.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteCost(c.id)}
                      className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-600 hover:text-red-400 rounded-lg transition-colors ml-auto">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

const CAT_COLORS: Record<string, string> = {
  Purchase: 'bg-purple-500/15 text-purple-400',
  Parts: 'bg-blue-500/15 text-blue-400',
  Repair: 'bg-orange-500/15 text-orange-400',
  Transport: 'bg-cyan-500/15 text-cyan-400',
  Detailing: 'bg-pink-500/15 text-pink-400',
  Advertising: 'bg-yellow-500/15 text-yellow-400',
  Inspection: 'bg-indigo-500/15 text-indigo-400',
  Other: 'bg-gray-500/15 text-gray-400',
}

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CAT_COLORS[cat] ?? 'bg-gray-500/15 text-gray-400'
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{cat}</span>
}
