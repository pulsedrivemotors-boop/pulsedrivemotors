import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SessionProvider } from './SessionProvider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        {session && <AdminSidebar userName={session.user?.email ?? undefined} />}
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
