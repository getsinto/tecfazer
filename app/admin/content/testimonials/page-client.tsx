'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Eye, EyeOff, Search, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import DeleteDialog from '@/components/admin/DeleteDialog'

interface Testimonial {
  id: string
  clientName: string
  company: string
  country: string
  photo: string | null
  rating: number
  reviewPt: string
  isPublished: boolean
}

interface TestimonialsClientProps {
  testimonials: Testimonial[]
}

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null)

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const query = searchQuery.toLowerCase()
    return (
      testimonial.clientName.toLowerCase().includes(query) ||
      testimonial.company.toLowerCase().includes(query) ||
      testimonial.country.toLowerCase().includes(query) ||
      testimonial.reviewPt.toLowerCase().includes(query)
    )
  })

  const openDeleteDialog = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!testimonialToDelete) return

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Testimonial deleted successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete testimonial')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const togglePublished = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !testimonial.isPublished }),
      })

      if (response.ok) {
        toast.success(
          testimonial.isPublished ? 'Testimonial unpublished' : 'Testimonial published'
        )
        router.refresh()
      } else {
        toast.error('Failed to update testimonial')
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
          placeholder="Search testimonials by client, company, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Testimonials grid */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No testimonials found matching your search' : 'No testimonials yet'}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.clientName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-teal to-brand-orange text-lg font-bold text-white">
                        {testimonial.clientName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{testimonial.clientName}</h3>
                      {!testimonial.isPublished && (
                        <Badge variant="secondary" className="text-xs">
                          Unpublished
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.company} • {testimonial.country}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                  {testimonial.reviewPt}
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/content/testimonials/${testimonial.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePublished(testimonial)}
                    title={testimonial.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {testimonial.isPublished ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(testimonial)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Testimonial?"
        description="This will permanently delete this testimonial. This action cannot be undone."
        itemName={testimonialToDelete?.clientName || ''}
      />
    </>
  )
}
