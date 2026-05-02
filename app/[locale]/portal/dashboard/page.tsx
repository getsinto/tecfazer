import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { ShoppingBag, Folder, MessageSquare, CreditCard, ArrowRight, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PortalDashboardPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'
  if (!session?.user?.email) return null

  const clientUser = await db.clientUser.findUnique({
    where: { email: session.user.email },
    include: {
      projects: { take: 3, orderBy: { createdAt: 'desc' } },
      documents: { take: 3, orderBy: { uploadedAt: 'desc' } },
      tickets: { where: { status: 'OPEN' }, take: 3, orderBy: { createdAt: 'desc' } },
    },
  }).catch(() => null)

  const orders = await db.order.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: 'desc' },
    take: 5,
  }).catch(() => [])

  const activeOrders = orders.filter(o => o.status === 'PAID')
  const firstName = session.user?.name?.split(' ')[0] || (isPt ? 'Cliente' : 'Client')
  const hour = new Date().getHours()
  const greeting = isPt
    ? hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
    : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: isPt ? 'Servicos Ativos' : 'Active Services', value: activeOrders.length, icon: ShoppingBag, color: 'from-[#1B7A8A] to-cyan-500', href: `/${params.locale}/portal/servicos` },
    { label: isPt ? 'Projetos' : 'Projects', value: clientUser?.projects.length || 0, icon: Folder, color: 'from-violet-500 to-purple-600', href: `/${params.locale}/portal/projetos` },
    { label: isPt ? 'Mensagens' : 'Messages', value: clientUser?.tickets.length || 0, icon: MessageSquare, color: 'from-orange-500 to-amber-500', href: `/${params.locale}/portal/tickets` },
    { label: isPt ? 'Pagamentos' : 'Payments', value: orders.length, icon: CreditCard, color: 'from-emerald-500 to-teal-500', href: `/${params.locale}/portal/faturacao` },
  ]

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">{greeting},</p>
          <h1 className="text-3xl font-black text-slate-900">{firstName} 👋</h1>
          <p className="text-slate-500 mt-1">
            {isPt ? 'Bem-vindo ao seu painel de cliente.' : 'Welcome to your client dashboard.'}
          </p>
        </div>
        <Link href={`/${params.locale}/servicos`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          {isPt ? 'Comprar Servico' : 'Buy Service'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="group rounded-2xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Active Services */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">{isPt ? 'Servicos Ativos' : 'Active Services'}</h2>
            <Link href={`/${params.locale}/portal/servicos`} className="text-xs font-semibold text-[#1B7A8A] hover:underline">
              {isPt ? 'Ver todos' : 'View all'} →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {activeOrders.length > 0 ? activeOrders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {(order as any).serviceTitle || (order as any).plan?.namePt || 'Service'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {isPt ? 'Ativo' : 'Active'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-10 text-center">
                <ShoppingBag className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-3">{isPt ? 'Nenhum servico ainda' : 'No services yet'}</p>
                <Link href={`/${params.locale}/servicos`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B7A8A] px-4 py-2 text-xs font-bold text-white hover:bg-[#156570] transition-colors">
                  {isPt ? 'Explorar Servicos' : 'Explore Services'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">{isPt ? 'Mensagens Recentes' : 'Recent Messages'}</h2>
            <Link href={`/${params.locale}/portal/tickets`} className="text-xs font-semibold text-[#1B7A8A] hover:underline">
              {isPt ? 'Ver todas' : 'View all'} →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {clientUser?.tickets && clientUser.tickets.length > 0 ? clientUser.tickets.map(ticket => (
              <div key={ticket.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{ticket.subject}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(ticket.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {isPt ? 'Aberto' : 'Open'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-10 text-center">
                <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-3">{isPt ? 'Nenhuma mensagem' : 'No messages'}</p>
                <Link href={`/${params.locale}/portal/tickets`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
                  {isPt ? 'Enviar Mensagem' : 'Send Message'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: ShoppingBag, label: isPt ? 'Comprar Servico' : 'Buy Service', href: `/${params.locale}/servicos`, color: 'bg-[#1B7A8A]/10 text-[#1B7A8A]' },
          { icon: MessageSquare, label: isPt ? 'Nova Mensagem' : 'New Message', href: `/${params.locale}/portal/tickets`, color: 'bg-orange-50 text-orange-600' },
          { icon: TrendingUp, label: isPt ? 'Ver Progresso' : 'View Progress', href: `/${params.locale}/portal/projetos`, color: 'bg-violet-50 text-violet-600' },
          { icon: CreditCard, label: isPt ? 'Faturacao' : 'Billing', href: `/${params.locale}/portal/faturacao`, color: 'bg-emerald-50 text-emerald-600' },
        ].map(a => (
          <Link key={a.label} href={a.href}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-slate-200 p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
