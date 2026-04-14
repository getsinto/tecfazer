'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import FeaturesBuilder from '@/components/admin/FeaturesBuilder'

const pricingPlanSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  namePt: z.string().min(1, 'Portuguese name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  monthlyPrice: z.number().min(0, 'Monthly price must be positive'),
  annualPrice: z.number().min(0, 'Annual price must be positive'),
  currency: z.string().default('EUR'),
  features: z.array(z.any()).default([]),
  isPopular: z.boolean().default(false),
  stripePriceIdMonthly: z.string().optional(),
  stripePriceIdAnnual: z.string().optional(),
  ctaTextPt: z.string().min(1, 'Portuguese CTA text is required'),
  ctaTextEn: z.string().min(1, 'English CTA text is required'),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

type PricingPlanFormData = z.infer<typeof pricingPlanSchema>

export default function PricingPlanEditPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PricingPlanFormData>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues: {
      currency: 'EUR',
      features: [],
      isPopular: false,
      isActive: true,
      order: 0,
    },
  })

  const features = watch('features')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchPricingPlan()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchPricingPlan = async () => {
    try {
      const response = await fetch(`/api/admin/pricing/${params.id}`)
      if (response.ok) {
        const plan = await response.json()
        Object.keys(plan).forEach((key) => {
          if (key === 'monthlyPrice' || key === 'annualPrice') {
            setValue(key, Number(plan[key]))
          } else {
            setValue(key as keyof PricingPlanFormData, plan[key])
          }
        })
      } else {
        toast.error('Failed to load pricing plan')
      }
    } catch (error) {
      toast.error('Error loading pricing plan')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: PricingPlanFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/pricing'
          : `/api/admin/pricing/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new' ? 'Pricing plan created!' : 'Pricing plan updated!'
        )
        router.push('/admin/pricing')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save pricing plan')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pricing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Pricing Plan' : 'Edit Pricing Plan'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Create a new pricing plan'
              : 'Update pricing plan information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="starter-plan"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="namePt">Name (PT) *</Label>
                    <Input
                      id="namePt"
                      {...register('namePt')}
                      placeholder="Plano Inicial"
                    />
                    {errors.namePt && (
                      <p className="text-sm text-destructive">
                        {errors.namePt.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Name (EN) *</Label>
                    <Input
                      id="nameEn"
                      {...register('nameEn')}
                      placeholder="Starter Plan"
                    />
                    {errors.nameEn && (
                      <p className="text-sm text-destructive">
                        {errors.nameEn.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPrice">Monthly Price *</Label>
                    <Input
                      id="monthlyPrice"
                      type="number"
                      step="0.01"
                      {...register('monthlyPrice', { valueAsNumber: true })}
                      placeholder="29.99"
                    />
                    {errors.monthlyPrice && (
                      <p className="text-sm text-destructive">
                        {errors.monthlyPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualPrice">Annual Price *</Label>
                    <Input
                      id="annualPrice"
                      type="number"
                      step="0.01"
                      {...register('annualPrice', { valueAsNumber: true })}
                      placeholder="299.99"
                    />
                    {errors.annualPrice && (
                      <p className="text-sm text-destructive">
                        {errors.annualPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      {...register('currency')}
                      placeholder="EUR"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripePriceIdMonthly">
                      Stripe Price ID (Monthly)
                    </Label>
                    <Input
                      id="stripePriceIdMonthly"
                      {...register('stripePriceIdMonthly')}
                      placeholder="price_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripePriceIdAnnual">
                      Stripe Price ID (Annual)
                    </Label>
                    <Input
                      id="stripePriceIdAnnual"
                      {...register('stripePriceIdAnnual')}
                      placeholder="price_..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CTA Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ctaTextPt">CTA Text (PT) *</Label>
                    <Input
                      id="ctaTextPt"
                      {...register('ctaTextPt')}
                      placeholder="Começar Agora"
                    />
                    {errors.ctaTextPt && (
                      <p className="text-sm text-destructive">
                        {errors.ctaTextPt.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaTextEn">CTA Text (EN) *</Label>
                    <Input
                      id="ctaTextEn"
                      {...register('ctaTextEn')}
                      placeholder="Get Started"
                    />
                    {errors.ctaTextEn && (
                      <p className="text-sm text-destructive">
                        {errors.ctaTextEn.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <FeaturesBuilder
                  value={features}
                  onChange={(newFeatures) => setValue('features', newFeatures)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    {...register('isPopular')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isPopular" className="cursor-pointer">
                    Mark as Popular
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Pricing Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
