import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, Folder, MessageSquare, CreditCard, LogOut, User, ShoppingBag, Bell } from 'lucide-react'
import { auth } from '@/lib/auth'
import PortalMobileNav from '@/components/portal/PortalMobileNav'

export const dynamic = 'force-dynamic'

// Icon map for server-side rendering in sidebar
const ICON_MAP: Record<string, React.ElementType> = {
  Home, FileText, Folder, MessageSquare, CreditCard, User, ShoppingBag, Bell,
}

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
    // auth() failed — redirect to login
  }

  // Not authenticated — redirect to login
  if (!session?.user) {
    redirect(`/${params.locale}/portal/login`)
  }

  const isPt = params.locale === 'pt'

  const navigation = [
    { name: 'Dashboard', href: `/${params.locale}/portal/dashboard`, iconName: 'Home' },
    { name: isPt ? 'Os Meus Servicos' : 'My Services', href: `/${params.locale}/portal/servicos`, iconName: 'ShoppingBag' },
    { name: isPt ? 'Projetos' : 'Projects', href: `/${params.locale}/portal/projetos`, iconName: 'Folder' },
    { name: isPt ? 'Mensagens' : 'Messages', href: `/${params.locale}/portal/tickets`, iconName: 'MessageSquare' },
    { name: isPt ? 'Documentos' : 'Documents', href: `/${params.locale}/portal/documentos`, iconName: 'FileText' },
    { name: isPt ? 'Faturacao' : 'Billing', href: `/${params.locale}/portal/faturacao`, iconName: 'CreditCard' },
    { name: isPt ? 'Perfil' : 'Profile', href: `/${params.locale}/portal/perfil`, iconName: 'User' },
  ]

  const userInitial = session.user?.name?.charAt(0)?.toUpperCase() || 'U'
  const userName = session.user?.name || ''
  const userEmail = session.user?.email || ''

  return (
    <div className="min-h-screen bg-[#f0f2f5]">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#0a0f1e] z-50 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <Link href={`/${params.locale}`} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-lg">
              TF
            </div>
            <div>
              <span className="font-black text-white text-sm">Tec Fazer</span>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Client Portal</p>
            </div>
          </Link>
        </div>

        {/* User card */}
        <div className="mx-4 mt-4 mb-2 rounded-xl bg-white/5 p-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-md">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{userName}</p>
              <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = ICON_MAP[item.iconName] || Home
            return (
              <Link key={item.name} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all text-sm font-medium group">
                <Icon className="w-4 h-4 flex-shrink-0 group-hover:text-[#1B7A8A] transition-colors" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
          <Link href={`/${params.locale}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-all text-xs font-medium">
            <Bell className="w-4 h-4" />
            {isPt ? 'Voltar ao Site' : 'Back to Website'}
          </Link>
          <Link href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" />
            {isPt ? 'Sair' : 'Logout'}
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <PortalMobileNav
        navigation={navigation}
        userInitial={userInitial}
        userName={userName}
        userEmail={userEmail}
        locale={params.locale}
        isPt={isPt}
      />

      {/* Main */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
