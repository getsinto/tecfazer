import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { CreditCard, Download, ExternalLink } from 'lucide-react'

export default async function PortalBillingPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'

  if (!session?.user?.email) return null

  // Fetch orders
  const orders = await db.order.findMany({
    where: { customerEmail: session.user.email },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const activeOrder = orders.find((o) => o.status === 'PAID')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700'
      case 'REFUNDED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const translateStatus = (status: string) => {
    if (!isPt) return status
    switch (status) {
      case 'PAID': return 'Pago'
      case 'PENDING': return 'Pendente'
      case 'CANCELLED': return 'Cancelado'
      case 'REFUNDED': return 'Reembolsado'
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isPt ? 'Faturação' : 'Billing'}
        </h1>
        <p className="text-gray-600">
          {isPt ? 'Gerencie a sua subscrição e histórico de pagamentos' : 'Manage your subscription and payment history'}
        </p>
      </div>

      {/* Active Subscription */}
      {activeOrder ? (
        <div className="bg-gradient-to-r from-brand-teal to-brand-orange rounded-xl p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isPt ? 'Subscrição Ativa' : 'Active Subscription'}
              </h2>
              <p className="text-white/90 text-lg">
                {isPt ? activeOrder.plan.namePt : activeOrder.plan.nameEn}
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-white/80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-white/80 mb-1">{isPt ? 'Valor' : 'Amount'}</p>
              <p className="text-3xl font-bold">
                €{Number(activeOrder.amount).toFixed(2)}
              </p>
              <p className="text-sm text-white/80">
                /{activeOrder.billingCycle === 'MONTHLY' ? (isPt ? 'mês' : 'month') : (isPt ? 'ano' : 'year')}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">{isPt ? 'Próximo Pagamento' : 'Next Payment'}</p>
              <p className="text-xl font-bold">
                {new Date(new Date(activeOrder.paidAt!).setMonth(new Date(activeOrder.paidAt!).getMonth() + (activeOrder.billingCycle === 'MONTHLY' ? 1 : 12))).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">{isPt ? 'Estado' : 'Status'}</p>
              <p className="text-xl font-bold">{isPt ? 'Ativa' : 'Active'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              {isPt ? 'Gerir Subscrição' : 'Manage Subscription'}
            </button>
            <button className="px-6 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all">
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{isPt ? 'Nenhuma subscrição ativa' : 'No active subscription'}</h3>
          <p className="text-gray-600 mb-6">
            {isPt ? 'Escolha um plano para começar' : 'Choose a plan to get started'}
          </p>
          <a
            href={`/${params.locale}/precos`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all"
          >
            {isPt ? 'Ver Planos' : 'View Plans'}
          </a>
        </div>
      )}

      {/* Order History */}
      {orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">{isPt ? 'Histórico de Pagamentos' : 'Payment History'}</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Data' : 'Date'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Plano' : 'Plan'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Valor' : 'Amount'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Estado' : 'Status'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {isPt ? 'Ações' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{isPt ? order.plan.namePt : order.plan.nameEn}</p>
                      <p className="text-sm text-gray-600">
                        {order.billingCycle === 'MONTHLY' ? (isPt ? 'Mensal' : 'Monthly') : (isPt ? 'Anual' : 'Annual')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    €{Number(order.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors font-medium">
                      <Download className="w-4 h-4" />
                      {isPt ? 'Fatura' : 'Invoice'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
