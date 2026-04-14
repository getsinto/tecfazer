import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

const settingsUpdateSchema = z.object({
  siteTitlePt: z.string().min(1).optional(),
  siteTitleEn: z.string().min(1).optional(),
  metaDescriptionPt: z.string().min(1).optional(),
  metaDescriptionEn: z.string().min(1).optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z.any().optional(),
  googleAnalyticsId: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.siteSettings.findFirst({
      where: { identifier: 'MAIN' },
    })

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsUpdateSchema.parse(body)

    // Find or create settings
    let settings = await prisma.siteSettings.findFirst({
      where: { identifier: 'MAIN' },
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.siteSettings.create({
        data: {
          identifier: 'MAIN',
          siteTitlePt: validatedData.siteTitlePt || 'Tec Fazer',
          siteTitleEn: validatedData.siteTitleEn || 'Tec Fazer',
          metaDescriptionPt:
            validatedData.metaDescriptionPt ||
            'Soluções tecnológicas inovadoras',
          metaDescriptionEn:
            validatedData.metaDescriptionEn || 'Innovative technology solutions',
          phone: validatedData.phone || '',
          address: validatedData.address || '',
          email: validatedData.email || 'info@tecfazer.pt',
          socialLinks: validatedData.socialLinks || {},
          maintenanceMode: validatedData.maintenanceMode || false,
        },
      })
    } else {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: validatedData,
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
