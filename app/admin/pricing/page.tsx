import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import PricingClient from './page-client'

export const metadata = {
  title: 'Pricing Plans - Admin',
}

async function getPricingPlans() {
  const [plans, orders] = await Promise.all([
    db.pricingPlan.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),
    db.order.groupBy({
      by: ['planId'],
      _count: true,
      _sum: {
        amount: true,
      },
      where: {
        status: 'PAID',
      },
    }),
  ])

  // Merge order stats with plans
  const plansWithStats = plans.map((plan) => {
    const orderStats = orders.find((o) => o.planId === plan.id)
    return {
      ...plan,
      monthlyPrice: Number(plan.monthlyPrice),
      annualPrice: Number(plan.annualPrice),
      paidOrders: orderStats?._count || 0,
      totalRevenue: Number(orderStats?._sum.amount || 0),
    }
  })

  return plansWithStats
}

export default async function AdminPricingPage() {
  const plans = await getPricingPlans()

  const activeCount = plans.filter((p) => p.isActive).length
  const totalRevenue = plans.reduce((sum, p) => sum + p.totalRevenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground">
            Manage your subscription plans
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pricing/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-sm text-muted-foreground">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {plans.reduce((sum, p) => sum + p.paidOrders, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No pricing plans yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/pricing/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <PricingClient plans={plans} />
      )}
    </div>
  )
}
