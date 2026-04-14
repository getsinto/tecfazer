import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, FileText, Folder, MessageSquare, CreditCard, LogOut } from 'lucide-react'
import { auth } from '@/lib/auth'

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session) {
    redirect(`/${params.locale}/portal/login`)
  }

  const isPt = params.locale === 'pt'

  const navigation = [
    { 
      name: isPt ? 'Dashboard' : 'Dashboard', 
      href: `/${params.locale}/portal/dashboard`, 
      icon: Home 
    },
    { 
      name: isPt ? 'Projetos' : 'Projects', 
      href: `/${params.locale}/portal/projetos`, 
      icon: Folder 
    },
    { 
      name: isPt ? 'Documentos' : 'Documents', 
      href: `/${params.locale}/portal/documentos`, 
      icon: FileText 
    },
    { 
      name: isPt ? 'Tickets' : 'Tickets', 
      href: `/${params.locale}/portal/tickets`, 
      icon: MessageSquare 
    },
    { 
      name: isPt ? 'Faturação' : 'Billing', 
      href: `/${params.locale}/portal/faturacao`, 
      icon: CreditCard 
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href={`/${params.locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-teal to-brand-orange rounded-lg flex items-center justify-center text-white font-bold">
                TF
              </div>
              <span className="font-bold text-xl">Tec Fazer</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-orange rounded-full flex items-center justify-center text-white font-bold text-lg">
                {session.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{session.user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{isPt ? 'Sair' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
