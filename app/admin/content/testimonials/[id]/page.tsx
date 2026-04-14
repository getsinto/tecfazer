'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import ImageUploader from '@/components/admin/ImageUploader'

const testimonialSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  company: z.string().min(1, 'Company is required'),
  country: z.string().min(1, 'Country is required'),
  photo: z.string().optional(),
  rating: z.number().min(1).max(5),
  reviewPt: z.string().min(1, 'Portuguese review is required'),
  reviewEn: z.string().min(1, 'English review is required'),
  serviceId: z.string().optional(),
  isPublished: z.boolean().default(false),
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

export default function TestimonialEditPage({
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
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 5,
      isPublished: false,
    },
  })

  const photo = watch('photo')
  const rating = watch('rating')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchTestimonial()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${params.id}`)
      if (response.ok) {
        const testimonial = await response.json()
        Object.keys(testimonial).forEach((key) => {
          setValue(key as keyof TestimonialFormData, testimonial[key])
        })
      } else {
        toast.error('Failed to load testimonial')
      }
    } catch (error) {
      toast.error('Error loading testimonial')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: TestimonialFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/testimonials'
          : `/api/admin/testimonials/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new'
            ? 'Testimonial created!'
            : 'Testimonial updated!'
        )
        router.push('/admin/content/testimonials')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save testimonial')
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
          <Link href="/admin/content/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Testimonial' : 'Edit Testimonial'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Add a new customer testimonial'
              : 'Update testimonial information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    {...register('clientName')}
                    placeholder="João Silva"
                  />
                  {errors.clientName && (
                    <p className="text-sm text-destructive">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Tech Company Ltd"
                    />
                    {errors.company && (
                      <p className="text-sm text-destructive">
                        {errors.company.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      placeholder="Portugal"
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service ID (Optional)</Label>
                  <Input
                    id="serviceId"
                    {...register('serviceId')}
                    placeholder="Service ID"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewPt">Portuguese Review *</Label>
                  <Textarea
                    id="reviewPt"
                    {...register('reviewPt')}
                    rows={5}
                    placeholder="Avaliação em português..."
                  />
                  {errors.reviewPt && (
                    <p className="text-sm text-destructive">
                      {errors.reviewPt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewEn">English Review *</Label>
                  <Textarea
                    id="reviewEn"
                    {...register('reviewEn')}
                    rows={5}
                    placeholder="Review in English..."
                  />
                  {errors.reviewEn && (
                    <p className="text-sm text-destructive">
                      {errors.reviewEn.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={photo}
                  onChange={(url) => setValue('photo', url)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </p>
                {errors.rating && (
                  <p className="text-sm text-destructive">
                    {errors.rating.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    {...register('isPublished')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer">
                    Published
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
                  Save Testimonial
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
