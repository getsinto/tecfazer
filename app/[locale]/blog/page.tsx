import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Search } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Blog - Insights e Tendências Tech | Tec Fazer',
    titleEn: 'Blog - Tech Insights and Trends | Tec Fazer',
    descPt: 'Artigos sobre desenvolvimento web, tecnologia, design e transformação digital. Mantenha-se atualizado com as últimas tendências.',
    descEn: 'Articles about web development, technology, design and digital transformation. Stay updated with the latest trends.',
    path: '/blog',
  })
}

export default async function BlogPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string }
  searchParams: { category?: string; search?: string }
}) {
  const t = await getTranslations('blog')
  
  // Build query filters
  const where: any = { isPublished: true }
  
  if (searchParams.category) {
    where.categories = { has: searchParams.category }
  }
  
  if (searchParams.search) {
    where.OR = [
      { titlePt: { contains: searchParams.search, mode: 'insensitive' } },
      { titleEn: { contains: searchParams.search, mode: 'insensitive' } },
      { excerptPt: { contains: searchParams.search, mode: 'insensitive' } },
      { excerptEn: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  // Fetch blog posts
  const posts = await db.blogPost.findMany({
    where,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  }).catch(() => [])

  // Get all unique categories
  const allPosts = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { categories: true },
  }).catch(() => [])
  
  const allCategories = allPosts.flatMap((p) => p.categories)
  const uniqueCategories = Array.from(new Set(allCategories))

  const dateLocale = params.locale === 'pt' ? ptBR : enUS

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">
              {params.locale === 'pt' ? 'Blog' : 'Blog'}
            </h1>
            <p className="text-xl text-gray-600">
              {params.locale === 'pt' 
                ? 'Insights, tendências e conhecimento sobre tecnologia'
                : 'Insights, trends and knowledge about technology'}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={params.locale === 'pt' ? 'Pesquisar artigos...' : 'Search articles...'}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`/${params.locale}/blog`}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  !searchParams.category
                    ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-teal'
                }`}
              >
                {params.locale === 'pt' ? 'Todos' : 'All'}
              </Link>
              {uniqueCategories.map((category) => (
                <Link
                  key={category}
                  href={`/${params.locale}/blog?category=${category}`}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    searchParams.category === category
                      ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-teal'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = params.locale === 'pt' ? post.titlePt : post.titleEn
              const excerpt = params.locale === 'pt' ? post.excerptPt : post.excerptEn
              const publishedDate = post.publishedAt 
                ? format(new Date(post.publishedAt), 'PPP', { locale: dateLocale })
                : ''

              return (
                <Link
                  key={post.id}
                  href={`/${params.locale}/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Featured Image */}
                    <div className="relative h-48 overflow-hidden">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs rounded-full font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-3 group-hover:text-brand-teal transition-colors line-clamp-2">
                        {title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readingTimeMinutes} min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4" />
                        <span>{publishedDate}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {params.locale === 'pt' 
                  ? 'Nenhum artigo encontrado.' 
                  : 'No articles found.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {params.locale === 'pt' 
              ? 'Receba as últimas novidades' 
              : 'Get the latest updates'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {params.locale === 'pt'
              ? 'Subscreva a nossa newsletter e fique a par das últimas tendências'
              : 'Subscribe to our newsletter and stay up to date with the latest trends'}
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder={params.locale === 'pt' ? 'O seu email' : 'Your email'}
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all">
              {params.locale === 'pt' ? 'Subscrever' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
