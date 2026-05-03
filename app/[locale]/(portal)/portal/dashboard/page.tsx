import { auth } from '@/lib/auth'
import { ShoppingBag, Folder, MessageSquare, CreditCard, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PortalDashboardPage({ params }: { params: { locale: string } }) {
  let session = null
  try {
    session = await auth()
  } catch {
    // auth failed
  }

  const isPt = params.locale === 'pt'
  const firstName = session?.user?.name?.split(' ')[0] || (isPt ? 'Cliente' : 'Client')
  const hour = new Date().getHours()
  const greeting = isPt
    ? hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
    : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: isPt ? 'Servicos Ativos' : 'Active Services', value: '0', icon: ShoppingBag, color: 'from-[#1B7A8A] to-cyan-500', href: `/${params.locale}/portal/servicos` },
    { label: isPt ? 'Projetos' : 'Projects', value: '0', icon: Folder, color: 'from-violet-500 to-purple-600', href: `/${params.locale}/portal/projetos` },
    { label: isPt ? 'Mensagens' : 'Messages', value: '0', icon: MessageSquare, color: 'from-orange-500 to-amber-500', href: `/${params.locale}/portal/tickets` },
    { label: isPt ? 'Pagamentos' : 'Payments', value: '0', icon: CreditCard, color: 'from-emerald-500 to-teal-500', href: `/${params.locale}/portal/faturacao` },
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

      {/* Info box */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1B7A8A]/10 to-[#F5A623]/10 border border-[#1B7A8A]/20 p-6">
        <h3 className="font-bold text-slate-900 mb-2">
          {isPt ? 'Como comecar?' : 'How to get started?'}
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          {isPt
            ? 'Explore os nossos servicos, faca uma compra e acompanhe o progresso do seu projeto aqui no portal.'
            : 'Explore our services, make a purchase and track your project progress here in the portal.'}
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href={`/${params.locale}/servicos`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B7A8A] px-4 py-2 text-sm font-bold text-white hover:bg-[#156570] transition-colors">
            {isPt ? 'Ver Servicos' : 'View Services'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${params.locale}/contacto`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
            {isPt ? 'Falar Connosco' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </div>
  )
}
