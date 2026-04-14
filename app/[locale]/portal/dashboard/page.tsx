import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { CreditCard, Folder, FileText, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function PortalDashboardPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'

  if (!session?.user?.email) {
    return null
  }

  // Fetch client data
  const clientUser = await db.clientUser.findUnique({
    where: { email: session.user.email },
    include: {
      projects: { take: 5, orderBy: { createdAt: 'desc' } },
      documents: { take: 5, orderBy: { uploadedAt: 'desc' } },
      tickets: { where: { status: 'OPEN' } },
    },
  }).catch(() => null)

  // Fetch active subscription
  const activeOrder = await db.order.findFirst({
    where: {
      customerEmail: session.user.email,
      status: 'PAID',
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => null)

  const stats = [
    {
      name: isPt ? 'Projetos Ativos' : 'Active Projects',
      value: clientUser?.projects.length || 0,
      icon: Folder,
      href: `/${params.locale}/portal/projetos`,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: isPt ? 'Documentos' : 'Documents',
      value: clientUser?.documents.length || 0,
      icon: FileText,
      href: `/${params.locale}/portal/documentos`,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: isPt ? 'Tickets Abertos' : 'Open Tickets',
      value: clientUser?.tickets.length || 0,
      icon: MessageSquare,
      href: `/${params.locale}/portal/tickets`,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      name: isPt ? 'Subscrição' : 'Subscription',
      value: activeOrder ? (isPt ? 'Ativa' : 'Active') : (isPt ? 'Nenhuma' : 'None'),
      icon: CreditCard,
      href: `/${params.locale}/portal/faturacao`,
      color: 'text-purple-600 bg-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isPt ? 'Bem-vindo de volta' : 'Welcome back'}, {session.user.name}!
        </h1>
        <p className="text-gray-600">
          {isPt ? 'Aqui está um resumo da sua conta' : "Here's a summary of your account"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.name}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Active Subscription */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-brand-teal to-brand-orange rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            {isPt ? 'Subscrição Ativa' : 'Active Subscription'}
          </h2>
          <p className="text-white/90 mb-4">
            {isPt ? activeOrder.plan.namePt : activeOrder.plan.nameEn}
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-white/80">{isPt ? 'Valor' : 'Amount'}</p>
              <p className="text-2xl font-bold">
                €{Number(activeOrder.amount).toFixed(2)}/{activeOrder.billingCycle === 'MONTHLY' ? (isPt ? 'mês' : 'month') : (isPt ? 'ano' : 'year')}
              </p>
            </div>
            <Link
              href={`/${params.locale}/portal/faturacao`}
              className="ml-auto px-6 py-2 bg-white text-brand-teal font-medium rounded-lg hover:shadow-lg transition-all"
            >
              {isPt ? 'Gerir' : 'Manage'}
            </Link>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      {clientUser && clientUser.projects.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isPt ? 'Projetos Recentes' : 'Recent Projects'}</h2>
            <Link
              href={`/${params.locale}/portal/projetos`}
              className="text-brand-teal hover:text-brand-orange transition-colors font-medium"
            >
              {isPt ? 'Ver todos' : 'View all'} →
            </Link>
          </div>
          <div className="space-y-4">
            {clientUser.projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-brand-teal transition-colors">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {isPt ? 'Ativo' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href={`/${params.locale}/portal/tickets`}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="w-8 h-8 text-brand-teal mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {isPt ? 'Criar Ticket' : 'Create Ticket'}
          </h3>
          <p className="text-gray-600">
            {isPt ? 'Precisa de ajuda? Abra um ticket de suporte' : 'Need help? Open a support ticket'}
          </p>
        </Link>

        <Link
          href={`/${params.locale}/contacto`}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Folder className="w-8 h-8 text-brand-orange mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {isPt ? 'Novo Projeto' : 'New Project'}
          </h3>
          <p className="text-gray-600">
            {isPt ? 'Tem uma nova ideia? Vamos conversar' : 'Have a new idea? Let\'s talk'}
          </p>
        </Link>
      </div>
    </div>
  )
}
