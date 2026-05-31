"use client"
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, Car, ChevronRight, Calendar, X, Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'
import Papa from 'papaparse'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function monthLabel(ym: string) {
  const [y, m] = ym.split('-')
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`
}

function fmt(n: number | null, currency = true) {
  if (n === null) return '—'
  const abs = Math.abs(n)
  const s = currency ? `$${abs.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : `${abs.toFixed(1)}%`
  return n < 0 ? `-${s}` : s
}

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
}
const STATUS_COLOR: Record<string, string> = {
  available: 'text-lime-400',
  reserved: 'text-yellow-400',
  sold: 'text-gray-400',
}

export default function AccountingPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all')
  const [monthFilter, setMonthFilter] = useState('') // empty = all time, otherwise 'YYYY-MM'
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/accounting/summary')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  const monthOptions = useMemo(() => {
    if (!data) return []
    const set = new Set<string>()
    data.rows.forEach((r: any) => { if (r.soldDate) set.add(r.soldDate.slice(0, 7)) })
    return Array.from(set).sort().reverse()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.rows.filter((r: any) => {
      if (filter !== 'all' && r.status !== filter) return false
      // Month filter only applies to the Sold tab
      if (filter === 'sold' && monthFilter) {
        if (!r.soldDate || r.soldDate.slice(0, 7) !== monthFilter) return false
      }
      return true
    })
  }, [data, filter, monthFilter])

  const computedStats = useMemo(() => {
    if (!data) return null
    if (!(filter === 'sold' && monthFilter)) return data.stats
    const sold = filtered.filter((r: any) => r.profit !== null)
    const totalProfit = sold.reduce((s: number, r: any) => s + r.profit, 0)
    const totalInvested = filtered.reduce((s: number, r: any) => s + r.totalInvested, 0)
    const avgProfitPct = sold.length > 0
      ? sold.reduce((s: number, r: any) => s + (r.profitPct ?? 0), 0) / sold.length
      : 0
    return {
      totalVehicles: filtered.length,
      soldCount: sold.length,
      totalProfit,
      totalInvested,
      avgProfitPct,
    }
  }, [data, filtered, filter, monthFilter])

  if (loading || !data || !computedStats) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const stats = computedStats

  // ---- Export (sold cars, respects month filter) ----
  const exportScope = filter === 'sold' && monthFilter ? monthLabel(monthFilter) : 'All time'
  const exportSlug = filter === 'sold' && monthFilter ? monthFilter : 'all-time'

  function buildExportRows() {
    const sold = filtered.filter((r: any) => r.status === 'sold')
    return sold.map((r: any) => ({
      Vehicle: r.name,
      'Sold Date': r.soldDate ? r.soldDate.slice(0, 10) : '',
      'Purchase Price': r.purchasePrice ?? 0,
      Expenses: r.totalCosts ?? 0,
      'Total Cost': r.totalInvested ?? 0,
      'Sold Price': r.soldPrice ?? 0,
      Profit: r.profit ?? 0,
      'Margin %': r.profitPct !== null ? Number(r.profitPct.toFixed(1)) : '',
      'Days to Sell': r.daysToSell ?? '',
    }))
  }

  function downloadBlob(content: BlobPart, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const rows = buildExportRows()
    const csv = Papa.unparse(rows)
    downloadBlob('﻿' + csv, `sold-cars-${exportSlug}.csv`, 'text/csv;charset=utf-8;')
    setExportOpen(false)
  }

  function exportPDF() {
    const rows = buildExportRows()
    const soldRows = filtered.filter((r: any) => r.status === 'sold')
    const totalProfit = soldRows.reduce((s: number, r: any) => s + (r.profit ?? 0), 0)
    const totalInvested = soldRows.reduce((s: number, r: any) => s + (r.totalInvested ?? 0), 0)
    const totalSold = soldRows.reduce((s: number, r: any) => s + (r.soldPrice ?? 0), 0)
    const money = (n: number) => '$' + Math.round(n).toLocaleString('en-CA')

    const body = rows.map((r: any) => `
      <tr>
        <td>${r.Vehicle}</td>
        <td>${r['Sold Date']}</td>
        <td class="num">${money(r['Purchase Price'])}</td>
        <td class="num">${money(r.Expenses)}</td>
        <td class="num">${money(r['Total Cost'])}</td>
        <td class="num">${money(r['Sold Price'])}</td>
        <td class="num ${r.Profit >= 0 ? 'pos' : 'neg'}">${r.Profit >= 0 ? '+' : ''}${money(r.Profit)}</td>
        <td class="num">${r['Margin %'] === '' ? '—' : r['Margin %'] + '%'}</td>
        <td class="num">${r['Days to Sell'] === '' ? '—' : r['Days to Sell'] + 'd'}</td>
      </tr>`).join('')

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Sold Cars — ${exportScope}</title>
      <style>
        * { font-family: -apple-system, Arial, sans-serif; }
        body { padding: 32px; color: #111; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .sub { color: #666; font-size: 13px; margin: 0 0 20px; }
        .kpis { display: flex; gap: 24px; margin-bottom: 20px; }
        .kpi { font-size: 13px; }
        .kpi span { display: block; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
        .kpi b { font-size: 18px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { padding: 7px 9px; border-bottom: 1px solid #e3e3e3; text-align: left; }
        th { background: #f5f5f5; font-size: 11px; text-transform: uppercase; letter-spacing: .3px; color: #555; }
        .num { text-align: right; }
        .pos { color: #16a34a; } .neg { color: #dc2626; }
        tfoot td { font-weight: bold; border-top: 2px solid #999; }
      </style></head><body>
      <h1>Sold Cars Report</h1>
      <p class="sub">Period: ${exportScope} &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString('en-CA')} &nbsp;·&nbsp; ${rows.length} vehicle(s)</p>
      <div class="kpis">
        <div class="kpi"><span>Total Sold</span><b>${money(totalSold)}</b></div>
        <div class="kpi"><span>Total Invested</span><b>${money(totalInvested)}</b></div>
        <div class="kpi"><span>Total Profit</span><b class="${totalProfit >= 0 ? 'pos' : 'neg'}">${totalProfit >= 0 ? '+' : ''}${money(totalProfit)}</b></div>
      </div>
      <table>
        <thead><tr>
          <th>Vehicle</th><th>Sold Date</th><th class="num">Purchase</th><th class="num">Expenses</th>
          <th class="num">Total Cost</th><th class="num">Sold For</th><th class="num">Profit</th>
          <th class="num">Margin</th><th class="num">Days</th>
        </tr></thead>
        <tbody>${body || '<tr><td colspan="9" style="text-align:center;padding:24px;color:#999">No sold vehicles</td></tr>'}</tbody>
      </table>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
    setExportOpen(false)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Accounting</h1>
          <p className="text-gray-400 text-sm">P&L tracking per vehicle — visible to owner only</p>
        </div>

        {/* Export sold cars */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(o => !o)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-lime-500 text-black font-bold hover:bg-lime-400 transition-colors"
          >
            <Download size={16} /> Export
            <ChevronDown size={14} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
          </button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 z-20 bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden shadow-xl">
                <div className="px-3 py-2 text-xs text-gray-500 border-b border-white/10">
                  Sold cars · {exportScope}
                </div>
                <button onClick={exportCSV}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors">
                  <FileSpreadsheet size={16} className="text-lime-400" /> Export as CSV
                </button>
                <button onClick={exportPDF}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors">
                  <FileText size={16} className="text-red-400" /> Export as PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Invested"
          value={fmt(stats.totalInvested)}
          icon={<DollarSign size={18} />}
          color="text-white"
        />
        <KpiCard
          label="Total Profit"
          value={fmt(stats.totalProfit)}
          icon={stats.totalProfit >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          color={stats.totalProfit >= 0 ? 'text-lime-400' : 'text-red-400'}
        />
        <KpiCard
          label="Avg Margin"
          value={fmt(stats.avgProfitPct, false)}
          icon={<TrendingUp size={18} />}
          color={stats.avgProfitPct >= 0 ? 'text-lime-400' : 'text-red-400'}
        />
        <KpiCard
          label="Vehicles Sold"
          value={`${stats.soldCount} / ${stats.totalVehicles}`}
          icon={<Car size={18} />}
          color="text-blue-400"
        />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(['all', 'available', 'sold'] as const).map(f => (
          <button key={f} onClick={() => { setFilter(f); if (f !== 'sold') setMonthFilter('') }}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors capitalize ${
              filter === f ? 'bg-lime-500 text-black font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}>
            {f === 'all' ? 'All' : STATUS_LABEL[f]}
          </button>
        ))}

        {/* Month filter — only for sold cars */}
        {filter === 'sold' && (
          <>
            <div className="flex-1" />
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={monthFilter}
                  onChange={e => setMonthFilter(e.target.value)}
                  disabled={monthOptions.length === 0}
                  className={`appearance-none pl-9 pr-8 py-1.5 rounded-lg text-sm border transition-colors ${
                    monthFilter
                      ? 'bg-lime-500/15 border-lime-500/40 text-lime-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  } disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-lime-500/50`}
                >
                  <option value="">All time</option>
                  {monthOptions.map((m: string) => (
                    <option key={m} value={m}>{monthLabel(m)}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>
              {monthFilter && (
                <button onClick={() => setMonthFilter('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {filter === 'sold' && monthFilter && (
        <p className="-mt-3 mb-5 text-xs text-gray-500">
          Showing vehicles sold in {monthLabel(monthFilter)}
        </p>
      )}

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-medium px-4 py-3">Vehicle</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Bought for</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Expenses</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Total Cost</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Sold for</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Profit</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Margin</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Days</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: any) => {
                const profitPositive = r.profit !== null && r.profit >= 0
                return (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{r.name}</p>
                      <span className={`text-xs ${STATUS_COLOR[r.status] ?? 'text-gray-500'}`}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {r.purchasePrice > 0 ? fmt(r.purchasePrice) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="text-gray-400">{r.costsCount > 0 ? fmt(r.totalCosts) : '—'}</span>
                      {r.costsCount > 0 && (
                        <span className="ml-1 text-gray-600 text-xs">({r.costsCount})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {r.totalInvested > 0 ? fmt(r.totalInvested) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {r.soldPrice !== null ? fmt(r.soldPrice) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {r.profit === null
                        ? <span className="text-gray-600">—</span>
                        : <span className={profitPositive ? 'text-lime-400' : 'text-red-400'}>
                            {profitPositive ? '+' : ''}{fmt(r.profit)}
                          </span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      {r.profitPct === null
                        ? <span className="text-gray-600">—</span>
                        : <ProfitBadge pct={r.profitPct} />
                      }
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-gray-300">
                      {r.daysToSell !== null
                        ? <span>{r.daysToSell}d</span>
                        : <span className="text-gray-600">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/accounting/${r.id}`}
                        className="inline-flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 transition-colors">
                        Detail <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-500">No vehicles</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function ProfitBadge({ pct }: { pct: number }) {
  const positive = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${
      positive ? 'bg-lime-500/15 text-lime-400' : 'bg-red-500/15 text-red-400'
    }`}>
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {positive ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}
