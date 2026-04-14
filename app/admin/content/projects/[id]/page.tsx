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
import { ArrowLeft, Save, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import TagsInput from '@/components/admin/TagsInput'
import ImageUploader from '@/components/admin/ImageUploader'

const projectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  descriptionPt: z.string().min(1, 'Portuguese description is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  challengePt: z.string().optional(),
  challengeEn: z.string().optional(),
  solutionPt: z.string().optional(),
  solutionEn: z.string().optional(),
  resultsPt: z.string().optional(),
  resultsEn: z.string().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  clientCountry: z.string().min(1, 'Client country is required'),
  liveUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  beforeImages: z.array(z.string()).default([]),
  afterImages: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isCaseStudy: z.boolean().default(false),
  duration: z.string().optional(),
  teamSize: z.number().optional(),
  budgetRange: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      categories: [],
      technologies: [],
      images: [],
      beforeImages: [],
      afterImages: [],
      isFeatured: false,
      isCaseStudy: false,
    },
  })

  const categories = watch('categories')
  const technologies = watch('technologies')
  const images = watch('images')
  const isCaseStudy = watch('isCaseStudy')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchProject()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`)
      if (response.ok) {
        const project = await response.json()
        Object.keys(project).forEach((key) => {
          if (key === 'teamSize') {
            setValue(key, project[key] ? Number(project[key]) : undefined)
          } else {
            setValue(key as keyof ProjectFormData, project[key])
          }
        })
      } else {
        toast.error('Failed to load project')
      }
    } catch (error) {
      toast.error('Error loading project')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/projects'
          : `/api/admin/projects/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new' ? 'Project created!' : 'Project updated!'
        )
        router.push('/admin/content/projects')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save project')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addImage = (url: string) => {
    if (url && !images.includes(url)) {
      setValue('images', [...images, url])
    }
  }

  const removeImage = (index: number) => {
    setValue('images', images.filter((_, i) => i !== index))
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
          <Link href="/admin/content/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Project' : 'Edit Project'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Create a new project showcase'
              : 'Update project information'}
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
                      placeholder="ecommerce-platform"
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="E-commerce Platform"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientCountry">Client Country *</Label>
                    <Input
                      id="clientCountry"
                      {...register('clientCountry')}
                      placeholder="Portugal"
                    />
                    {errors.clientCountry && (
                      <p className="text-sm text-destructive">
                        {errors.clientCountry.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input
                      id="liveUrl"
                      {...register('liveUrl')}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    {...register('videoUrl')}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionPt">Description (PT) *</Label>
                  <Textarea
                    id="descriptionPt"
                    {...register('descriptionPt')}
                    rows={4}
                    placeholder="Descrição do projeto em português..."
                  />
                  {errors.descriptionPt && (
                    <p className="text-sm text-destructive">
                      {errors.descriptionPt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Description (EN) *</Label>
                  <Textarea
                    id="descriptionEn"
                    {...register('descriptionEn')}
                    rows={4}
                    placeholder="Project description in English..."
                  />
                  {errors.descriptionEn && (
                    <p className="text-sm text-destructive">
                      {errors.descriptionEn.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {isCaseStudy && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="challengePt">Challenge (PT)</Label>
                      <Textarea
                        id="challengePt"
                        {...register('challengePt')}
                        rows={4}
                        placeholder="Desafio enfrentado..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challengeEn">Challenge (EN)</Label>
                      <Textarea
                        id="challengeEn"
                        {...register('challengeEn')}
                        rows={4}
                        placeholder="Challenge faced..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Solution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="solutionPt">Solution (PT)</Label>
                      <Textarea
                        id="solutionPt"
                        {...register('solutionPt')}
                        rows={4}
                        placeholder="Solução implementada..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solutionEn">Solution (EN)</Label>
                      <Textarea
                        id="solutionEn"
                        {...register('solutionEn')}
                        rows={4}
                        placeholder="Solution implemented..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resultsPt">Results (PT)</Label>
                      <Textarea
                        id="resultsPt"
                        {...register('resultsPt')}
                        rows={4}
                        placeholder="Resultados alcançados..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resultsEn">Results (EN)</Label>
                      <Textarea
                        id="resultsEn"
                        {...register('resultsEn')}
                        rows={4}
                        placeholder="Results achieved..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {images.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Project ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <ImageUploader
                  value=""
                  onChange={addImage}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    {...register('duration')}
                    placeholder="3 months"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    {...register('teamSize', { valueAsNumber: true })}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Input
                    id="budgetRange"
                    {...register('budgetRange')}
                    placeholder="€10k - €20k"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    {...register('isFeatured')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Project
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCaseStudy"
                    {...register('isCaseStudy')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isCaseStudy" className="cursor-pointer">
                    Case Study
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
                  Save Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
