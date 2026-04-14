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
import ImageUploader from '@/components/admin/ImageUploader'
import RichTextEditor from '@/components/admin/RichTextEditor'

const blogPostSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  titlePt: z.string().min(1, 'Portuguese title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  excerptPt: z.string().min(1, 'Portuguese excerpt is required'),
  excerptEn: z.string().min(1, 'English excerpt is required'),
  bodyPt: z.string().min(1, 'Portuguese body is required'),
  bodyEn: z.string().min(1, 'English body is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  readingTimeMinutes: z.number().min(1, 'Reading time must be at least 1 minute'),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isPublished: z.boolean().default(false),
})

type BlogPostFormData = z.infer<typeof blogPostSchema>

export default function BlogPostEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      categories: [],
      tags: [],
      isPublished: false,
      readingTimeMinutes: 5,
    },
  })

  const categories = watch('categories')
  const tags = watch('tags')
  const featuredImage = watch('featuredImage')
  const bodyPt = watch('bodyPt')
  const bodyEn = watch('bodyEn')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchBlogPost()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`)
      if (response.ok) {
        const post = await response.json()
        Object.keys(post).forEach((key) => {
          if (key === 'readingTimeMinutes') {
            setValue(key, Number(post[key]))
          } else if (key === 'bodyPt' || key === 'bodyEn') {
            // Convert JSON to HTML string if needed
            const content = typeof post[key] === 'string' 
              ? post[key] 
              : JSON.stringify(post[key])
            setValue(key, content)
          } else {
            setValue(key as keyof BlogPostFormData, post[key])
          }
        })
      } else {
        toast.error('Failed to load blog post')
      }
    } catch (error) {
      toast.error('Error loading blog post')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/blog'
          : `/api/admin/blog/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new' ? 'Blog post created!' : 'Blog post updated!'
        )
        router.push('/admin/content/blog')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save blog post')
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
          <Link href="/admin/content/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Create a new blog post'
              : 'Update blog post content'}
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
                    placeholder="getting-started-with-nextjs"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">
                      {errors.slug.message}
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
                    placeholder="Começando com Next.js"
                  />
                  {errors.titlePt && (
                    <p className="text-sm text-destructive">
                      {errors.titlePt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerptPt">Excerpt *</Label>
                  <Textarea
                    id="excerptPt"
                    {...register('excerptPt')}
                    rows={3}
                    placeholder="Breve resumo do artigo..."
                  />
                  {errors.excerptPt && (
                    <p className="text-sm text-destructive">
                      {errors.excerptPt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyPt">Body *</Label>
                  <RichTextEditor
                    content={bodyPt || ''}
                    onChange={(content) => setValue('bodyPt', content)}
                    placeholder="Escreva o conteúdo do artigo..."
                  />
                  {errors.bodyPt && (
                    <p className="text-sm text-destructive">
                      {errors.bodyPt.message}
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
                    placeholder="Getting Started with Next.js"
                  />
                  {errors.titleEn && (
                    <p className="text-sm text-destructive">
                      {errors.titleEn.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerptEn">Excerpt *</Label>
                  <Textarea
                    id="excerptEn"
                    {...register('excerptEn')}
                    rows={3}
                    placeholder="Brief summary of the article..."
                  />
                  {errors.excerptEn && (
                    <p className="text-sm text-destructive">
                      {errors.excerptEn.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyEn">Body *</Label>
                  <RichTextEditor
                    content={bodyEn || ''}
                    onChange={(content) => setValue('bodyEn', content)}
                    placeholder="Write the article content..."
                  />
                  {errors.bodyEn && (
                    <p className="text-sm text-destructive">
                      {errors.bodyEn.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitlePt">Meta Title (PT)</Label>
                    <Input
                      id="metaTitlePt"
                      {...register('metaTitlePt')}
                      placeholder="SEO title in Portuguese"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitleEn">Meta Title (EN)</Label>
                    <Input
                      id="metaTitleEn"
                      {...register('metaTitleEn')}
                      placeholder="SEO title in English"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaDescPt">Meta Description (PT)</Label>
                    <Textarea
                      id="metaDescPt"
                      {...register('metaDescPt')}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescEn">Meta Description (EN)</Label>
                    <Textarea
                      id="metaDescEn"
                      {...register('metaDescEn')}
                      rows={2}
                    />
                  </div>
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
                <CardTitle>Categories *</CardTitle>
              </CardHeader>
              <CardContent>
                <TagsInput
                  value={categories}
                  onChange={(tags) => setValue('categories', tags)}
                  placeholder="Add category..."
                />
                {errors.categories && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.categories.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <TagsInput
                  value={tags}
                  onChange={(tags) => setValue('tags', tags)}
                  placeholder="Add tag..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="readingTimeMinutes">Reading Time (min) *</Label>
                  <Input
                    id="readingTimeMinutes"
                    type="number"
                    {...register('readingTimeMinutes', { valueAsNumber: true })}
                  />
                  {errors.readingTimeMinutes && (
                    <p className="text-sm text-destructive">
                      {errors.readingTimeMinutes.message}
                    </p>
                  )}
                </div>
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
                  Save Blog Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
