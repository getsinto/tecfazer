import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { ShoppingBag, CheckCircle2, Clock, ArrowRight, ExternalLink, CreditCard } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PortalServicesPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'
  if (!session?.user?.email) return null

  const orders = await db.order.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const statusConfig: Record<string, { label: string; labelPt: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
    PAID:      { label: 'Active',    labelPt: 'Ativo',      bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
    PENDING:   { label: 'Pending',   labelPt: 'Pendente',   bg: 'bg-amber-100',   text: 'text-amber-700',   icon: Clock },
    CANCELLED: { label: 'Cancelled', labelPt: 'Cancelado',  bg: 'bg-slate-100',   text: 'text-slate-500',   icon: Clock },
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {isPt ? 'Os Meus Servicos' : 'My Services'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isPt ? 'Todos os servicos que adquiriu na Tec Fazer.' : 'All services you purchased from Tec Fazer.'}
          </p>
        </div>
        <Link href={`/${params.locale}/servicos`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          {isPt ? 'Comprar Novo Servico' : 'Buy New Service'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING
            const StatusIcon = cfg.icon
            const serviceTitle = (order as any).serviceTitle || (order as any).plan?.namePt || 'Service'
            return (
              <div key={order.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] shadow-md">
                        <ShoppingBag className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg">{serviceTitle}</h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                            <StatusIcon className="h-3 w-3" />
                            {isPt ? cfg.labelPt : cfg.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            {isPt ? 'Comprado em' : 'Purchased on'} {new Date(order.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">
                        {Number(order.amount).toFixed(0)} EUR
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isPt ? 'Pagamento unico' : 'One-time payment'}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar for active services */}
                  {order.status === 'PAID' && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          {isPt ? 'Progresso do Projeto' : 'Project Progress'}
                        </span>
                        <span className="text-xs font-bold text-[#1B7A8A]">
                          {isPt ? 'Em andamento' : 'In progress'}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623]" />
                      </div>
                      <div className="flex justify-between mt-2">
                        {[
                          isPt ? 'Pagamento' : 'Payment',
                          isPt ? 'Reuniao' : 'Meeting',
                          isPt ? 'Desenvolvimento' : 'Development',
                          isPt ? 'Entrega' : 'Delivery',
                        ].map((step, i) => (
                          <div key={step} className="flex flex-col items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${i < 2 ? 'bg-[#1B7A8A]' : 'bg-slate-200'}`} />
                            <span className="text-[10px] text-slate-400 hidden sm:block">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <Link href={`/${params.locale}/portal/tickets`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                      {isPt ? 'Enviar Mensagem' : 'Send Message'}
                    </Link>
                    <Link href={`/${params.locale}/portal/documentos`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                      {isPt ? 'Ver Documentos' : 'View Documents'}
                    </Link>
                    <Link href={`/${params.locale}/portal/faturacao`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                      <CreditCard className="h-3.5 w-3.5" />
                      {isPt ? 'Fatura' : 'Invoice'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-16 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            {isPt ? 'Nenhum servico ainda' : 'No services yet'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            {isPt ? 'Explore os nossos servicos e compre diretamente online.' : 'Explore our services and purchase directly online.'}
          </p>
          <Link href={`/${params.locale}/servicos`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
            {isPt ? 'Ver Todos os Servicos' : 'View All Services'}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
