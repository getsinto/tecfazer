'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import DeleteDialog from '@/components/admin/DeleteDialog'

interface Service {
  id: string
  slug: string
  category: string
  titlePt: string
  titleEn: string
  shortDescPt: string
  shortDescEn: string
  technologies: string[]
  isActive: boolean
}

interface ServicesClientProps {
  services: Service[]
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  // Filter services by search query
  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase()
    return (
      service.titlePt.toLowerCase().includes(query) ||
      service.titleEn.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      service.technologies.some((tech) => tech.toLowerCase().includes(query))
    )
  })

  const categories = Array.from(new Set(filteredServices.map((s) => s.category)))

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return

    try {
      const response = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Service deleted successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete service')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      })

      if (response.ok) {
        toast.success(
          service.isActive
            ? 'Service deactivated'
            : 'Service activated'
        )
        router.refresh()
      } else {
        toast.error('Failed to update service')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services by name, category, or technology..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services by category */}
      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No services found matching your search' : 'No services yet'}
        </div>
      ) : (
        categories.map((category) => {
          const categoryServices = filteredServices.filter(
            (s) => s.category === category
          )

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold capitalize">{category}</h2>
                <Badge variant="outline">{categoryServices.length}</Badge>
              </div>

              <div className="space-y-4">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{service.titlePt}</h3>
                        {!service.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.shortDescPt}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {service.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {service.technologies.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.technologies.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/content/services/${service.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(service)}
                        title={service.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {service.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(service)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Service?"
        description="This will permanently delete this service. This action cannot be undone."
        itemName={serviceToDelete?.titlePt || ''}
      />
    </>
  )
}
