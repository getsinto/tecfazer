'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const settingsSchema = z.object({
  siteTitlePt: z.string().min(1, 'Portuguese site title is required'),
  siteTitleEn: z.string().min(1, 'English site title is required'),
  metaDescriptionPt: z.string().min(1, 'Portuguese meta description is required'),
  metaDescriptionEn: z.string().min(1, 'English meta description is required'),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email address'),
  googleAnalyticsId: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
})

type SettingsFormData = z.infer<typeof settingsSchema>

interface SettingsClientProps {
  settings: {
    id: string
    siteTitlePt: string
    siteTitleEn: string
    metaDescriptionPt: string
    metaDescriptionEn: string
    logoUrl: string | null
    faviconUrl: string | null
    phone: string
    address: string
    email: string
    googleAnalyticsId: string | null
    maintenanceMode: boolean
  }
}

export default function SettingsClient({ settings }: SettingsClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
      logoUrl: settings.logoUrl || '',
      faviconUrl: settings.faviconUrl || '',
      googleAnalyticsId: settings.googleAnalyticsId || '',
    },
  })

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Settings updated successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update settings')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteTitlePt">Site Title (PT) *</Label>
                  <Input
                    id="siteTitlePt"
                    {...register('siteTitlePt')}
                    placeholder="Tec Fazer"
                  />
                  {errors.siteTitlePt && (
                    <p className="text-sm text-destructive">
                      {errors.siteTitlePt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTitleEn">Site Title (EN) *</Label>
                  <Input
                    id="siteTitleEn"
                    {...register('siteTitleEn')}
                    placeholder="Tec Fazer"
                  />
                  {errors.siteTitleEn && (
                    <p className="text-sm text-destructive">
                      {errors.siteTitleEn.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescriptionPt">
                  Meta Description (PT) *
                </Label>
                <Textarea
                  id="metaDescriptionPt"
                  {...register('metaDescriptionPt')}
                  rows={3}
                  placeholder="Soluções tecnológicas inovadoras..."
                />
                {errors.metaDescriptionPt && (
                  <p className="text-sm text-destructive">
                    {errors.metaDescriptionPt.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescriptionEn">
                  Meta Description (EN) *
                </Label>
                <Textarea
                  id="metaDescriptionEn"
                  {...register('metaDescriptionEn')}
                  rows={3}
                  placeholder="Innovative technology solutions..."
                />
                {errors.metaDescriptionEn && (
                  <p className="text-sm text-destructive">
                    {errors.metaDescriptionEn.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="info@tecfazer.pt"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+351 123 456 789"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  rows={2}
                  placeholder="Lisbon, Portugal"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  {...register('logoUrl')}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  {...register('faviconUrl')}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  {...register('googleAnalyticsId')}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Your Google Analytics measurement ID
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  {...register('maintenanceMode')}
                  className="h-4 w-4"
                />
                <Label htmlFor="maintenanceMode" className="cursor-pointer">
                  Enable maintenance mode
                </Label>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                When enabled, visitors will see a maintenance page
              </p>
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
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
