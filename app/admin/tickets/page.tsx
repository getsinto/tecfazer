import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { MessageSquare, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export const metadata = {
  title: 'Support Tickets - Admin',
}

async function getTicketsData() {
  const [tickets, openTickets, inProgressTickets, closedTickets] = await Promise.all([
    db.supportTicket.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    }),
    db.supportTicket.count({ where: { status: 'OPEN' } }),
    db.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
    db.supportTicket.count({ where: { status: 'CLOSED' } }),
  ])

  return {
    tickets,
    openTickets,
    inProgressTickets,
    closedTickets,
    totalTickets: openTickets + inProgressTickets + closedTickets,
  }
}

export default async function AdminTicketsPage() {
  const data = await getTicketsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage customer support requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Tickets"
          value={data.totalTickets}
          icon={MessageSquare}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Open"
          value={data.openTickets}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
        <StatCard
          title="In Progress"
          value={data.inProgressTickets}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Closed"
          value={data.closedTickets}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
      </div>

      {/* Tickets list */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.tickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tickets yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Subject</th>
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Messages</th>
                      <th className="pb-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b last:border-0">
                        <td className="py-4">
                          <p className="font-medium">{ticket.subject}</p>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm">{ticket.client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {ticket.client.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              ticket.priority === 'URGENT'
                                ? 'destructive'
                                : ticket.priority === 'HIGH'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {ticket.priority}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              ticket.status === 'OPEN'
                                ? 'destructive'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">
                            {ticket._count.messages}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {formatDate(ticket.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
