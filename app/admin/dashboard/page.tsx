import { db } from '@/lib/db'
import StatCard from '@/components/admin/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Mail,
  ShoppingCart,
  Users,
  TrendingUp,
  MessageSquare,
  Star,
  Eye,
  DollarSign,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Dashboard - Admin',
}

async function getDashboardStats() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get counts
  const [
    totalLeads,
    newLeads,
    totalOrders,
    paidOrders,
    totalClients,
    openTickets,
    totalReviews,
    avgRating,
    totalPageViews,
    recentLeads,
    recentOrders,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: 'NEW' } }),
    db.order.count(),
    db.order.count({ where: { status: 'PAID' } }),
    db.clientUser.count(),
    db.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    db.review.count({ where: { isPublished: true } }),
    db.review.aggregate({
      where: { isPublished: true },
      _avg: { rating: true },
    }),
    db.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        serviceInterest: true,
        status: true,
        createdAt: true,
      },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        plan: {
          select: {
            namePt: true,
            nameEn: true,
          },
        },
      },
    }),
  ])

  // Calculate revenue
  const revenue = await db.order.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true },
  })

  return {
    totalLeads,
    newLeads,
    totalOrders,
    paidOrders,
    totalClients,
    openTickets,
    totalReviews,
    avgRating: avgRating._avg.rating || 0,
    totalRevenue: revenue._sum.amount || 0,
    totalPageViews,
    recentLeads,
    recentOrders,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          change={{ value: 12, label: 'from last month' }}
          icon={Mail}
          iconColor="text-blue-600"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(Number(stats.totalRevenue))}
          change={{ value: 8, label: 'from last month' }}
          icon={DollarSign}
          iconColor="text-brand-orange"
        />
        <StatCard
          title="Paid Orders"
          value={stats.paidOrders}
          icon={ShoppingCart}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          iconColor="text-brand-teal"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={MessageSquare}
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Avg Rating"
          value={stats.avgRating.toFixed(1)}
          icon={Star}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Page Views (30d)"
          value={stats.totalPageViews.toLocaleString()}
          icon={Eye}
          iconColor="text-indigo-600"
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No leads yet</p>
              ) : (
                stats.recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      {lead.serviceInterest && (
                        <p className="text-xs text-muted-foreground">
                          {lead.serviceInterest}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          lead.status === 'NEW'
                            ? 'bg-green-100 text-green-700'
                            : lead.status === 'CONTACTED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.plan.namePt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(Number(order.amount))}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
