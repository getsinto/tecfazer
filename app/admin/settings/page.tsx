import { db } from '@/lib/db'
import SettingsClient from './page-client'

export const metadata = {
  title: 'Settings - Admin',
}

async function getSettings() {
  let settings = await db.siteSettings.findFirst({
    where: { identifier: 'MAIN' },
  })

  // Create default settings if they don't exist
  if (!settings) {
    settings = await db.siteSettings.create({
      data: {
        identifier: 'MAIN',
        siteTitlePt: 'Tec Fazer',
        siteTitleEn: 'Tec Fazer',
        metaDescriptionPt: 'Soluções tecnológicas inovadoras para o seu negócio',
        metaDescriptionEn: 'Innovative technology solutions for your business',
        phone: '+351 123 456 789',
        address: 'Lisbon, Portugal',
        email: 'info@tecfazer.pt',
        socialLinks: {},
        maintenanceMode: false,
      },
    })
  }

  return settings
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your site configuration and preferences
        </p>
      </div>

      <SettingsClient settings={settings} />
    </div>
  )
}
