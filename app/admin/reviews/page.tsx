import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Star, CheckCircle, Clock, Eye } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

export const metadata = {
  title: 'Reviews - Admin',
}

async function getReviewsData() {
  const [reviews, totalReviews, publishedReviews, pendingReviews, avgRating] =
    await Promise.all([
      db.review.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
      }),
      db.review.count(),
      db.review.count({ where: { isPublished: true } }),
      db.review.count({ where: { isPublished: false } }),
      db.review.aggregate({
        where: { isPublished: true },
        _avg: { rating: true },
      }),
    ])

  return {
    reviews,
    totalReviews,
    publishedReviews,
    pendingReviews,
    avgRating: avgRating._avg.rating || 0,
  }
}

export default async function AdminReviewsPage() {
  const data = await getReviewsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">
          Moderate and manage customer reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={data.totalReviews}
          icon={Star}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Published"
          value={data.publishedReviews}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
        <StatCard
          title="Pending"
          value={data.pendingReviews}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Avg Rating"
          value={data.avgRating.toFixed(1)}
          icon={Eye}
          iconColor="text-blue-600"
        />
      </div>

      {/* Reviews list */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet
              </p>
            ) : (
              data.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.clientName}</p>
                        {review.clientCompany && (
                          <span className="text-sm text-muted-foreground">
                            • {review.clientCompany}
                          </span>
                        )}
                        {review.clientCountry && (
                          <span className="text-sm text-muted-foreground">
                            • {review.clientCountry}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.reviewText}
                      </p>
                      {review.serviceUsed && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Service: {review.serviceUsed}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <Badge
                        variant={review.isPublished ? 'default' : 'secondary'}
                      >
                        {review.isPublished ? 'Published' : 'Pending'}
                      </Badge>
                      <Badge variant="outline">{review.source}</Badge>
                      {review.isVerified && (
                        <Badge variant="outline">Verified</Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
