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
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import TagsInput from '@/components/admin/TagsInput'
import IconSelector from '@/components/admin/IconSelector'
import ImageUploader from '@/components/admin/ImageUploader'

const serviceSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  titlePt: z.string().min(1, 'Portuguese title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  shortDescPt: z.string().min(1, 'Portuguese short description is required'),
  shortDescEn: z.string().min(1, 'English short description is required'),
  fullDescPt: z.string().min(1, 'Portuguese full description is required'),
  fullDescEn: z.string().min(1, 'English full description is required'),
  icon: z.string().min(1, 'Icon is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  featuredImage: z.string().optional(),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function ServiceEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      technologies: [],
      isActive: true,
      order: 0,
    },
  })

  const technologies = watch('technologies')
  const icon = watch('icon')
  const featuredImage = watch('featuredImage')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchService()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${params.id}`)
      if (response.ok) {
        const service = await response.json()
        Object.keys(service).forEach((key) => {
          setValue(key as keyof ServiceFormData, service[key])
        })
      } else {
        toast.error('Failed to load service')
      }
    } catch (error) {
      toast.error('Error loading service')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/services'
          : `/api/admin/services/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new' ? 'Service created!' : 'Service updated!'
        )
        router.push('/admin/content/services')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save service')
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
          <Link href="/admin/content/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Service' : 'Edit Service'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Create a new service offering'
              : 'Update service information'}
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="web-development"
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      {...register('category')}
                      placeholder="development"
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon *</Label>
                  <IconSelector
                    value={icon}
                    onChange={(value) => setValue('icon', value)}
                  />
                  {errors.icon && (
                    <p className="text-sm text-destructive">
                      {errors.icon.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portuguese Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titlePt">Title *</Label>
                  <Input
                    id="titlePt"
                    {...register('titlePt')}
                    placeholder="Desenvolvimento Web"
                  />
                  {errors.titlePt && (
                    <p className="text-sm text-destructive">
                      {errors.titlePt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescPt">Short Description *</Label>
                  <Textarea
                    id="shortDescPt"
                    {...register('shortDescPt')}
                    rows={2}
                  />
                  {errors.shortDescPt && (
                    <p className="text-sm text-destructive">
                      {errors.shortDescPt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullDescPt">Full Description *</Label>
                  <Textarea
                    id="fullDescPt"
                    {...register('fullDescPt')}
                    rows={5}
                  />
                  {errors.fullDescPt && (
                    <p className="text-sm text-destructive">
                      {errors.fullDescPt.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>English Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title *</Label>
                  <Input
                    id="titleEn"
                    {...register('titleEn')}
                    placeholder="Web Development"
                  />
                  {errors.titleEn && (
                    <p className="text-sm text-destructive">
                      {errors.titleEn.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescEn">Short Description *</Label>
                  <Textarea
                    id="shortDescEn"
                    {...register('shortDescEn')}
                    rows={2}
                  />
                  {errors.shortDescEn && (
                    <p className="text-sm text-destructive">
                      {errors.shortDescEn.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullDescEn">Full Description *</Label>
                  <Textarea
                    id="fullDescEn"
                    {...register('fullDescEn')}
                    rows={5}
                  />
                  {errors.fullDescEn && (
                    <p className="text-sm text-destructive">
                      {errors.fullDescEn.message}
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
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={featuredImage}
                  onChange={(url) => setValue('featuredImage', url)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies *</CardTitle>
              </CardHeader>
              <CardContent>
                <TagsInput
                  value={technologies}
                  onChange={(tags) => setValue('technologies', tags)}
                  placeholder="Add technology..."
                />
                {errors.technologies && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.technologies.message}
                  </p>
                )}
              </CardContent>
            </Card>

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
                  Save Service
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
