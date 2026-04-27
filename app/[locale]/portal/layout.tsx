import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, Folder, MessageSquare, CreditCard, LogOut } from 'lucide-react'
import { auth } from '@/lib/auth'
import PortalMobileNav from '@/components/portal/PortalMobileNav'

export const dynamic = 'force-dynamic'

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let session = null
  try {
    session = await auth()
  } catch {
    // auth() can throw if NEXTAUTH_SECRET is missing — redirect to login
    redirect(`/${params.locale}/portal/login`)
  }

  if (!session) {
    redirect(`/${params.locale}/portal/login`)
  }

  const isPt = params.locale === 'pt'

  const navigation = [
    { name: 'Dashboard', href: `/${params.locale}/portal/dashboard`, icon: Home },
    { name: isPt ? 'Projetos' : 'Projects', href: `/${params.locale}/portal/projetos`, icon: Folder },
    { name: isPt ? 'Documentos' : 'Documents', href: `/${params.locale}/portal/documentos`, icon: FileText },
    { name: 'Tickets', href: `/${params.locale}/portal/tickets`, icon: MessageSquare },
    { name: isPt ? 'Faturação' : 'Billing', href: `/${params.locale}/portal/faturacao`, icon: CreditCard },
  ]

  const userInitial = session.user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-white border-r border-gray-200 z-50 lg:flex">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href={`/${params.locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] rounded-lg flex items-center justify-center text-white font-bold">
                TF
              </div>
              <span className="font-bold text-xl">Tec Fazer</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] rounded-full flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>{isPt ? 'Sair' : 'Logout'}</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <PortalMobileNav
        navigation={navigation}
        userInitial={userInitial}
        userName={session.user?.name || ''}
        userEmail={session.user?.email || ''}
        locale={params.locale}
        isPt={isPt}
      />

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
