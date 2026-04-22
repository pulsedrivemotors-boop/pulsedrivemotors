"use client"
import { useEffect, useState } from 'react'
import { Car, Users, FileText, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalVehicles: number
  availableVehicles: number
  reservedVehicles: number
  soldVehicles: number
  totalLeads: number
  newLeads: number
  blogPosts: number
  publishedPosts: number
  recentLeads: any[]
  importLogs: any[]
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  negotiation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!stats) return null

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back to Pulse Drive Motors admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Vehicles', value: stats.totalVehicles, sub: `${stats.availableVehicles} available`, icon: <Car size={20} />, color: 'text-lime-400', href: '/admin/vehicles' },
          { label: 'Active Leads', value: stats.totalLeads, sub: `${stats.newLeads} new`, icon: <Users size={20} />, color: 'text-blue-400', href: '/admin/leads' },
          { label: 'Blog Posts', value: stats.blogPosts, sub: `${stats.publishedPosts} published`, icon: <FileText size={20} />, color: 'text-purple-400', href: '/admin/blog' },
          { label: 'Sold This Month', value: stats.soldVehicles, sub: `${stats.reservedVehicles} reserved`, icon: <TrendingUp size={20} />, color: 'text-orange-400', href: '/admin/vehicles?status=sold' },
        ].map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5 hover:border-lime-500/30 transition-colors">
            <div className={`${card.color} mb-3`}>{card.icon}</div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-white text-sm font-medium mt-0.5">{card.label}</p>
            <p className="text-gray-500 text-xs mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Leads</h2>
            <Link href="/admin/leads" className="text-lime-400 text-xs hover:text-lime-300 transition-colors">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentLeads.map((lead: any) => (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">{lead.vehicleInterest || lead.source}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                  {lead.status}
                </span>
              </Link>
            ))}
            {stats.recentLeads.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No leads yet</p>}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Inventory Overview</h2>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Available', count: stats.availableVehicles, total: stats.totalVehicles, color: 'bg-lime-500' },
              { label: 'Reserved', count: stats.reservedVehicles, total: stats.totalVehicles, color: 'bg-yellow-500' },
              { label: 'Sold', count: stats.soldVehicles, total: stats.totalVehicles, color: 'bg-gray-500' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{bar.label}</span>
                  <span className="text-white font-medium">{bar.count}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all`}
                    style={{ width: bar.total > 0 ? `${(bar.count / bar.total) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href="/admin/vehicles/new"
              className="flex-1 text-center bg-lime-500 hover:bg-lime-400 text-black font-medium text-sm py-2 rounded-lg transition-colors">
              + Add Vehicle
            </Link>
            <Link href="/admin/import"
              className="flex-1 text-center bg-white/10 hover:bg-white/15 text-white text-sm py-2 rounded-lg transition-colors">
              Import CSV
            </Link>
          </div>
        </div>

        {/* Import Logs */}
        {stats.importLogs.length > 0 && (
          <div className="bg-[#1a1a1a] border border-white/[0.15] rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-gray-400" />
              <h2 className="text-white font-semibold">Recent Imports</h2>
            </div>
            <div className="space-y-2">
              {stats.importLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg text-sm">
                  <span className="text-gray-300">{log.fileName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{log.count} vehicles</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${log.success ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                      {log.success ? 'Success' : 'Error'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
