import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShoppingCart, TrendingUp, DollarSign, CreditCard } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export const metadata = {
  title: 'Orders - Admin',
}

async function getOrdersData() {
  const [orders, stats] = await Promise.all([
    db.order.findMany({
      take: 50,
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
    db.order.aggregate({
      _count: true,
      _sum: { amount: true },
    }),
  ])

  const paidOrders = await db.order.count({ where: { status: 'PAID' } })
  const pendingOrders = await db.order.count({ where: { status: 'PENDING' } })

  return {
    orders,
    totalOrders: stats._count,
    totalRevenue: stats._sum.amount || 0,
    paidOrders,
    pendingOrders,
  }
}

export default async function AdminOrdersPage() {
  const data = await getOrdersData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(Number(data.totalRevenue))}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatCard
          title="Paid Orders"
          value={data.paidOrders}
          icon={CreditCard}
          iconColor="text-brand-teal"
        />
        <StatCard
          title="Pending Orders"
          value={data.pendingOrders}
          icon={TrendingUp}
          iconColor="text-yellow-600"
        />
      </div>

      {/* Orders list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No orders yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Billing</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{order.plan.namePt}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">
                            {formatCurrency(Number(order.amount))}
                          </p>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">
                            {order.billingCycle === 'MONTHLY' ? 'Monthly' : 'Annual'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              order.status === 'PAID'
                                ? 'default'
                                : order.status === 'PENDING'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
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
