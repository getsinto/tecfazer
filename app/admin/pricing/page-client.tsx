'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Eye, EyeOff, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { formatCurrency } from '@/lib/utils'

interface PricingPlan {
  id: string
  slug: string
  namePt: string
  nameEn: string
  monthlyPrice: number
  annualPrice: number
  isPopular: boolean
  isActive: boolean
  stripePriceIdMonthly: string | null
  stripePriceIdAnnual: string | null
  paidOrders: number
  totalRevenue: number
}

interface PricingClientProps {
  plans: PricingPlan[]
}

export default function PricingClient({ plans }: PricingClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null)

  const filteredPlans = plans.filter((plan) => {
    const query = searchQuery.toLowerCase()
    return (
      plan.namePt.toLowerCase().includes(query) ||
      plan.nameEn.toLowerCase().includes(query) ||
      plan.slug.toLowerCase().includes(query)
    )
  })

  const openDeleteDialog = (plan: PricingPlan) => {
    setPlanToDelete(plan)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!planToDelete) return

    try {
      const response = await fetch(`/api/admin/pricing/${planToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Pricing plan deleted successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete pricing plan')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const toggleActive = async (plan: PricingPlan) => {
    try {
      const response = await fetch(`/api/admin/pricing/${plan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      })

      if (response.ok) {
        toast.success(
          plan.isActive ? 'Pricing plan deactivated' : 'Pricing plan activated'
        )
        router.refresh()
      } else {
        toast.error('Failed to update pricing plan')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search pricing plans by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Plans grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No pricing plans found matching your search' : 'No pricing plans yet'}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className={plan.isPopular ? 'border-brand-teal' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{plan.namePt}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.nameEn}</p>
                  </div>
                  <div className="flex gap-1">
                    {plan.isPopular && (
                      <Badge variant="default">Popular</Badge>
                    )}
                    {!plan.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {formatCurrency(plan.monthlyPrice)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(plan.annualPrice)}/year
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.paidOrders} subscriptions</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Revenue: </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(plan.totalRevenue)}
                    </span>
                  </div>

                  {/* Stripe IDs */}
                  {(plan.stripePriceIdMonthly || plan.stripePriceIdAnnual) && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {plan.stripePriceIdMonthly && (
                        <div className="truncate">
                          Monthly: {plan.stripePriceIdMonthly}
                        </div>
                      )}
                      {plan.stripePriceIdAnnual && (
                        <div className="truncate">
                          Annual: {plan.stripePriceIdAnnual}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/admin/pricing/${plan.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(plan)}
                      title={plan.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {plan.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(plan)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Pricing Plan?"
        description="This will permanently delete this pricing plan. This action cannot be undone."
        itemName={planToDelete?.namePt || ''}
      />
    </>
  )
}
