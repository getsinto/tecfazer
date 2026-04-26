import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Search, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { getDbClient } from '@/lib/db'
import { buildMetadata } from '@/lib/seo'
import SectionReveal from '@/components/ui/SectionReveal'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

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
  
  let posts: any[] = []
  let uniqueCategories: string[] = []
  
  try {
    const db = getDbClient()
    
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

    posts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    })

    const allPosts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: { categories: true },
    })
    
    const allCategories = allPosts.flatMap((p) => p.categories)
    uniqueCategories = Array.from(new Set(allCategories))
  } catch (error) {
    console.error('Database not available:', error)
  }

  const dateLocale = params.locale === 'pt' ? ptBR : enUS

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <BookOpen className="h-4 w-4" />
                {params.locale === 'pt' ? 'Conhecimento & Insights' : 'Knowledge & Insights'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {params.locale === 'pt' ? 'Blog' : 'Blog'}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl">
                {params.locale === 'pt' 
                  ? 'Insights, tendências e conhecimento sobre tecnologia'
                  : 'Insights, trends and knowledge about technology'}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Search and Filter */}
      {uniqueCategories.length > 0 && (
        <section className="border-b bg-white py-8 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={params.locale === 'pt' ? 'Pesquisar artigos...' : 'Search articles...'}
                  className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 transition-all focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href={`/${params.locale}/blog`}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    !searchParams.category
                      ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white shadow-lg'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-teal hover:shadow-md'
                  }`}
                >
                  {params.locale === 'pt' ? 'Todos' : 'All'}
                </Link>
                {uniqueCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/${params.locale}/blog?category=${category}`}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                      searchParams.category === category
                        ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white shadow-lg'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-teal hover:shadow-md'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const title = params.locale === 'pt' ? post.titlePt : post.titleEn
                const excerpt = params.locale === 'pt' ? post.excerptPt : post.excerptEn
                const publishedDate = post.publishedAt 
                  ? format(new Date(post.publishedAt), 'PPP', { locale: dateLocale })
                  : ''

                return (
                  <SectionReveal key={post.id} delay={index * 0.1}>
                    <Link
                      href={`/${params.locale}/blog/${post.slug}`}
                      className="group block h-full"
                    >
                      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        {/* Featured Image */}
                        <div className="relative h-56 overflow-hidden">
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-teal to-brand-orange">
                              <span className="text-6xl font-bold text-white">
                                {title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-6">
                          {/* Categories */}
                          <div className="mb-3 flex flex-wrap gap-2">
                            {post.categories.slice(0, 2).map((category: string) => (
                              <span
                                key={category}
                                className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal"
                              >
                                {category}
                              </span>
                            ))}
                          </div>

                          {/* Title */}
                          <h2 className="mb-3 text-xl font-bold transition-colors group-hover:text-brand-teal line-clamp-2">
                            {title}
                          </h2>

                          {/* Excerpt */}
                          <p className="mb-4 flex-1 text-slate-600 line-clamp-3">
                            {excerpt}
                          </p>

                          {/* Meta */}
                          <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{post.author.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readingTimeMinutes} min</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Calendar className="h-4 w-4" />
                              <span>{publishedDate}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </SectionReveal>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-16 text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg text-muted-foreground">
                {params.locale === 'pt' 
                  ? 'Nenhum artigo encontrado.' 
                  : 'No articles found.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <TrendingUp className="mx-auto mb-6 h-16 w-16 text-brand-orange" />
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {params.locale === 'pt' 
                  ? 'Receba as Últimas Novidades' 
                  : 'Get the Latest Updates'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {params.locale === 'pt'
                  ? 'Subscreva a nossa newsletter e fique a par das últimas tendências'
                  : 'Subscribe to our newsletter and stay up to date with the latest trends'}
              </p>
              <div className="mx-auto flex max-w-md gap-3">
                <input
                  type="email"
                  placeholder={params.locale === 'pt' ? 'O seu email' : 'Your email'}
                  className="flex-1 rounded-xl px-6 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
                  {params.locale === 'pt' ? 'Subscrever' : 'Subscribe'}
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
