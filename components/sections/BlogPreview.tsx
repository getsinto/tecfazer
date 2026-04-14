import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'
import db from '@/lib/db'

export default async function BlogPreview() {
  const t = await getTranslations('blog')

  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { author: true },
  }).catch(() => [])

  if (posts.length === 0) return null

  return (
    <SectionReveal>
      <section className="py-20 bg-white">
        <div className="container px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('sectionSubtitle')}
            </p>
          </div>

          {/* Blog posts grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {post.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.titlePt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  {post.categories.length > 0 && (
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold mb-3">
                      {post.categories[0]}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-brand-teal transition-colors">
                    {post.titlePt}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerptPt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTimeMinutes} {t('minRead')}</span>
                    </div>
                  </div>
                  <Link
                    href={`/pt/blog/${post.slug}`}
                    className="inline-flex items-center text-brand-teal font-semibold hover:gap-2 transition-all"
                  >
                    {t('readMore')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View all button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white"
            >
              <Link href="/pt/blog">
                {t('allPosts')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
