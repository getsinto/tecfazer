import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { CreditCard, Download, CheckCircle2, Clock, XCircle, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PortalBillingPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'
  if (!session?.user?.email) return null

  const orders = await db.order.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const totalSpent = orders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + Number(o.amount), 0)
  const activeCount = orders.filter(o => o.status === 'PAID').length

  const statusConfig: Record<string, { label: string; labelPt: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
    PAID:      { label: 'Paid',      labelPt: 'Pago',        bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
    PENDING:   { label: 'Pending',   labelPt: 'Pendente',    bg: 'bg-amber-100',   text: 'text-amber-700',   icon: Clock },
    CANCELLED: { label: 'Cancelled', labelPt: 'Cancelado',   bg: 'bg-slate-100',   text: 'text-slate-500',   icon: XCircle },
    REFUNDED:  { label: 'Refunded',  labelPt: 'Reembolsado', bg: 'bg-red-100',     text: 'text-red-700',     icon: XCircle },
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{isPt ? 'Faturacao' : 'Billing'}</h1>
        <p className="text-slate-500 mt-1">{isPt ? 'Historico de pagamentos e faturas.' : 'Payment history and invoices.'}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: isPt ? 'Total Gasto' : 'Total Spent', value: `${totalSpent.toFixed(0)} EUR`, icon: CreditCard, color: 'from-[#1B7A8A] to-cyan-500' },
          { label: isPt ? 'Servicos Ativos' : 'Active Services', value: String(activeCount), icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
          { label: isPt ? 'Total de Pedidos' : 'Total Orders', value: String(orders.length), icon: Clock, color: 'from-violet-500 to-purple-600' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      {orders.length > 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-900">{isPt ? 'Historico de Pagamentos' : 'Payment History'}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{isPt ? 'Data' : 'Date'}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{isPt ? 'Servico' : 'Service'}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{isPt ? 'Valor' : 'Amount'}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{isPt ? 'Estado' : 'Status'}</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">{isPt ? 'Acoes' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => {
                  const cfg = statusConfig[order.status] || statusConfig.PENDING
                  const StatusIcon = cfg.icon
                  const serviceTitle = (order as any).serviceTitle || (order as any).plan?.namePt || 'Service'
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{serviceTitle}</p>
                        <p className="text-xs text-slate-400 mt-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 whitespace-nowrap">
                        {Number(order.amount).toFixed(0)} EUR
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon className="h-3 w-3" />
                          {isPt ? cfg.labelPt : cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                          <Download className="h-3.5 w-3.5" />
                          {isPt ? 'Fatura' : 'Invoice'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-16 text-center">
          <CreditCard className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-black text-slate-900 mb-2">{isPt ? 'Nenhum pagamento ainda' : 'No payments yet'}</h3>
          <p className="text-slate-500 text-sm mb-5">{isPt ? 'Compre um servico para ver o historico aqui.' : 'Purchase a service to see history here.'}</p>
          <Link href={`/${params.locale}/servicos`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
            {isPt ? 'Ver Servicos' : 'View Services'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Manage subscription */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{isPt ? 'Gerir Subscricao' : 'Manage Subscription'}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{isPt ? 'Aceda ao portal de faturacao Stripe para gerir metodos de pagamento.' : 'Access the Stripe billing portal to manage payment methods.'}</p>
        </div>
        <Link href="/api/stripe/portal"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
          <ExternalLink className="h-4 w-4" />
          {isPt ? 'Portal de Faturacao' : 'Billing Portal'}
        </Link>
      </div>
    </div>
  )
}
