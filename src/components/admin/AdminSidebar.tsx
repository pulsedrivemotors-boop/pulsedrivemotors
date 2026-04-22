"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Car, Users, FileText, Upload, LogOut, ExternalLink, Menu, X, Star } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { href: '/admin/vehicles/new', label: 'Add Vehicle', icon: Star, sub: true },
  { href: '/admin/import', label: 'CSV Import', icon: Upload, sub: true },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/blog/new', label: 'New Post', icon: FileText, sub: true },
]

function SidebarContent({ userName, pathname, onNavClick }: { userName?: string; pathname: string; onNavClick: () => void }) {
  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin')

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <svg width="32" height="20" viewBox="0 0 200 60" fill="none">
            <polyline points="0,30 30,30 45,8 55,52 65,15 75,45 85,30 200,30" fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-white font-bold text-sm leading-none">PULSE DRIVE</p>
            <p className="text-lime-400 text-xs tracking-widest">ADMIN</p>
          </div>
        </div>
        {userName && <p className="text-gray-400 text-xs mt-2 truncate">{userName}</p>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link key={item.href} href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${item.sub ? 'ml-4' : ''} ${active ? 'bg-lime-500/20 text-lime-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={item.sub ? 14 : 16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <ExternalLink size={16} /> View Site
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#1a1a1a] border border-white/20 rounded-lg flex items-center justify-center text-gray-300">
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-[#111111] border-r border-white/10 z-50 transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent userName={userName} pathname={pathname} onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-[#111111] border-r border-white/10 min-h-screen">
        <SidebarContent userName={userName} pathname={pathname} onNavClick={() => {}} />
      </aside>
    </>
  )
}
