import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import TestimonialsClient from './page-client'

export const metadata = {
  title: 'Testimonials - Admin',
}

async function getTestimonials() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { date: 'desc' },
  })

  return testimonials
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  const publishedCount = testimonials.filter((t) => t.isPublished).length
  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer testimonials
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/testimonials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{testimonials.length}</div>
            <p className="text-sm text-muted-foreground">Total Testimonials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {testimonials.length - publishedCount}
            </div>
            <p className="text-sm text-muted-foreground">Unpublished</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No testimonials yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/testimonials/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Testimonial
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TestimonialsClient testimonials={testimonials} />
      )}
    </div>
  )
}
