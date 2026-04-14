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

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rolePt: z.string().min(1, 'Portuguese role is required'),
  roleEn: z.string().min(1, 'English role is required'),
  bioPt: z.string().min(1, 'Portuguese bio is required'),
  bioEn: z.string().min(1, 'English bio is required'),
  photo: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

export default function TeamMemberEditPage({
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
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      skills: [],
      isActive: true,
      order: 0,
    },
  })

  const skills = watch('skills')
  const photo = watch('photo')

  useEffect(() => {
    if (params.id !== 'new') {
      fetchTeamMember()
    } else {
      setIsFetching(false)
    }
  }, [params.id])

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${params.id}`)
      if (response.ok) {
        const member = await response.json()
        Object.keys(member).forEach((key) => {
          setValue(key as keyof TeamMemberFormData, member[key])
        })
      } else {
        toast.error('Failed to load team member')
      }
    } catch (error) {
      toast.error('Error loading team member')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsLoading(true)

    try {
      const url =
        params.id === 'new'
          ? '/api/admin/team'
          : `/api/admin/team/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(
          params.id === 'new' ? 'Team member added!' : 'Team member updated!'
        )
        router.push('/admin/content/team')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save team member')
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
          <Link href="/admin/content/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {params.id === 'new' ? 'New Team Member' : 'Edit Team Member'}
          </h1>
          <p className="text-muted-foreground">
            {params.id === 'new'
              ? 'Add a new team member'
              : 'Update team member information'}
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
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="João Silva"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rolePt">Role (PT) *</Label>
                    <Input
                      id="rolePt"
                      {...register('rolePt')}
                      placeholder="Desenvolvedor Full-Stack"
                    />
                    {errors.rolePt && (
                      <p className="text-sm text-destructive">
                        {errors.rolePt.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleEn">Role (EN) *</Label>
                    <Input
                      id="roleEn"
                      {...register('roleEn')}
                      placeholder="Full-Stack Developer"
                    />
                    {errors.roleEn && (
                      <p className="text-sm text-destructive">
                        {errors.roleEn.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bioPt">Portuguese Bio *</Label>
                  <Textarea
                    id="bioPt"
                    {...register('bioPt')}
                    rows={4}
                    placeholder="Biografia em português..."
                  />
                  {errors.bioPt && (
                    <p className="text-sm text-destructive">
                      {errors.bioPt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bioEn">English Bio *</Label>
                  <Textarea
                    id="bioEn"
                    {...register('bioEn')}
                    rows={4}
                    placeholder="Biography in English..."
                  />
                  {errors.bioEn && (
                    <p className="text-sm text-destructive">
                      {errors.bioEn.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    {...register('linkedIn')}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    {...register('github')}
                    placeholder="https://github.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo</CardTitle>
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
                <CardTitle>Skills *</CardTitle>
              </CardHeader>
              <CardContent>
                <TagsInput
                  value={skills}
                  onChange={(tags) => setValue('skills', tags)}
                  placeholder="Add skill..."
                />
                {errors.skills && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.skills.message}
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
                  Save Team Member
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
