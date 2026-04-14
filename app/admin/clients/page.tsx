import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Users, UserCheck, Mail } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export const metadata = {
  title: 'Clients - Admin',
}

async function getClientsData() {
  const [clients, totalClients, verifiedClients] = await Promise.all([
    db.clientUser.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            projects: true,
            tickets: true,
          },
        },
      },
    }),
    db.clientUser.count(),
    db.clientUser.count({ where: { emailVerified: true } }),
  ])

  return {
    clients,
    totalClients,
    verifiedClients,
  }
}

export default async function AdminClientsPage() {
  const data = await getClientsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Manage client accounts and portal access
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Clients"
          value={data.totalClients}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Verified Clients"
          value={data.verifiedClients}
          icon={UserCheck}
          iconColor="text-green-600"
        />
        <StatCard
          title="Unverified"
          value={data.totalClients - data.verifiedClients}
          icon={Mail}
          iconColor="text-yellow-600"
        />
      </div>

      {/* Clients list */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.clients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No clients yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Company</th>
                      <th className="pb-3 font-medium">Projects</th>
                      <th className="pb-3 font-medium">Tickets</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clients.map((client) => (
                      <tr key={client.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">
                            {client.companyName || '-'}
                          </p>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">
                            {client._count.projects}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">
                            {client._count.tickets}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              client.emailVerified ? 'default' : 'secondary'
                            }
                          >
                            {client.emailVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {formatDate(client.createdAt)}
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
