import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ServicesClient from './page-client'

export const metadata = {
  title: 'Services - Admin',
}

async function getServices() {
  const services = await db.service.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return services
}

export default async function AdminServicesPage() {
  const services = await getServices()

  const categories = Array.from(new Set(services.map((s) => s.category)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-sm text-muted-foreground">Total Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {services.filter((s) => s.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {services.filter((s) => !s.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No services yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ServicesClient services={services} />
      )}
    </div>
  )
}
