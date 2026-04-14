import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { MessageSquare, Plus } from 'lucide-react'

export default async function PortalTicketsPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'

  if (!session?.user?.email) return null

  const clientUser = await db.clientUser.findUnique({
    where: { email: session.user.email },
    include: {
      tickets: {
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  }).catch(() => null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-700'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700'
      case 'LOW':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const translateStatus = (status: string) => {
    if (!isPt) return status.replace('_', ' ')
    switch (status) {
      case 'OPEN': return 'Aberto'
      case 'IN_PROGRESS': return 'Em Progresso'
      case 'CLOSED': return 'Fechado'
      default: return status
    }
  }

  const translatePriority = (priority: string) => {
    if (!isPt) return priority
    switch (priority) {
      case 'URGENT': return 'Urgente'
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isPt ? 'Tickets de Suporte' : 'Support Tickets'}
          </h1>
          <p className="text-gray-600">
            {isPt ? 'Gerencie os seus pedidos de suporte' : 'Manage your support requests'}
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {isPt ? 'Novo Ticket' : 'New Ticket'}
        </button>
      </div>

      {clientUser && clientUser.tickets.length > 0 ? (
        <div className="space-y-4">
          {clientUser.tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {translateStatus(ticket.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {translatePriority(ticket.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isPt ? 'Criado em' : 'Created on'} {new Date(ticket.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </p>
                </div>
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>

              {ticket.messages.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {ticket.messages[0].message}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {ticket.messages.length} {isPt ? 'mensagens' : 'messages'}
                </p>
                <button className="text-brand-teal hover:text-brand-orange transition-colors font-medium">
                  {isPt ? 'Ver Detalhes' : 'View Details'} →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{isPt ? 'Nenhum ticket ainda' : 'No tickets yet'}</h3>
          <p className="text-gray-600 mb-6">
            {isPt ? 'Precisa de ajuda? Crie um ticket de suporte' : 'Need help? Create a support ticket'}
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isPt ? 'Criar Ticket' : 'Create Ticket'}
          </button>
        </div>
      )}
    </div>
  )
}
