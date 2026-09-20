"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Receipt } from 'lucide-react'
import Papa from 'papaparse'

function fmt(n: number) {
  const abs = Math.abs(n)
  const s = `$${abs.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return n < 0 ? `-${s}` : s
}

export default function TaxReportPage() {
  const [rows, setRows] = useState<any[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/accounting/tax-report')
      .then(r => r.json())
      .then(d => setRows(d.rows))
  }, [])

  const exportCSV = () => {
    if (!rows) return
    const csv = Papa.unparse(rows.map(r => ({
      Year: r.year,
      'GST Collected (sales)': r.gstCollected.toFixed(2),
      'ITC — Purchases': r.itcPurchases.toFixed(2),
      'ITC — Expenses': r.itcExpenses.toFixed(2),
      'Total ITC': r.totalItc.toFixed(2),
      'Net Remittance': r.netRemittance.toFixed(2),
    })))
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gst-tax-report.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!rows) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Link href="/admin/accounting" className="mt-1 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-lg text-gray-400 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Receipt size={20} className="text-lime-500" /> Tax Report</h1>
            <p className="text-gray-400 text-sm">GST collected vs. ITCs, by calendar year — for your GST/HST return</p>
          </div>
        </div>
        <button onClick={exportCSV} disabled={rows.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-lime-500 text-black font-bold hover:bg-lime-400 disabled:opacity-40 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-medium px-4 py-3">Year</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">GST Collected</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">ITC — Purchases</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">ITC — Expenses</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Total ITC</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Net Remittance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.year} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-white font-semibold">{r.year}</td>
                  <td className="px-4 py-3 text-right text-gray-200">{fmt(r.gstCollected)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{fmt(r.itcPurchases)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{fmt(r.itcExpenses)}</td>
                  <td className="px-4 py-3 text-right text-yellow-400">{fmt(r.totalItc)}</td>
                  <td className={`px-4 py-3 text-right font-bold ${r.netRemittance >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                    {r.netRemittance >= 0 ? '' : '-'}{fmt(Math.abs(r.netRemittance))}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No tax data yet — fill in GST fields on the Accounting pages</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5 text-sm text-gray-400 space-y-2">
        <p><b className="text-white">GST Collected</b> — 5% GST charged to customers, attributed to the year the vehicle was sold.</p>
        <p><b className="text-white">ITC (Input Tax Credit)</b> — GST you paid that can be claimed back: on inventory purchases (attributed to the purchase year) and on other expenses like parts/repairs/advertising (attributed to the expense date).</p>
        <p><b className="text-white">Net Remittance</b> — Collected minus ITC. This is what you owe CRA for the year (or your refund, if negative).</p>
        <p className="text-gray-500">This is a bookkeeping aid, not a filed return — confirm final figures with your accountant before filing.</p>
      </div>
    </div>
  )
}
