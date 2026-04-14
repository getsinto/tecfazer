import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return {}

  const title = params.locale === 'pt' ? post.titlePt : post.titleEn
  const description = params.locale === 'pt' ? post.excerptPt : post.excerptEn

  return buildMetadata({
    locale: params.locale,
    titlePt: `${post.titlePt} | Blog Tec Fazer`,
    titleEn: `${post.titleEn} | Tec Fazer Blog`,
    descPt: post.excerptPt,
    descEn: post.excerptEn,
    path: `/blog/${params.slug}`,
    image: post.featuredImage || undefined,
  })
}

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return posts.flatMap((post) => [
    { locale: 'pt', slug: post.slug },
    { locale: 'en', slug: post.slug },
  ])
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      comments: {
        where: { isApproved: true, parentId: null },
        include: {
          replies: {
            where: { isApproved: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post || !post.isPublished) notFound()

  // Increment view count
  await db.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  const title = params.locale === 'pt' ? post.titlePt : post.titleEn
  const excerpt = params.locale === 'pt' ? post.excerptPt : post.excerptEn
  const body = params.locale === 'pt' ? post.bodyPt : post.bodyEn
  const dateLocale = params.locale === 'pt' ? ptBR : enUS
  const publishedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), 'PPP', { locale: dateLocale })
    : ''

  // Fetch related posts
  const relatedPosts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
      OR: [
        { categories: { hasSome: post.categories } },
        { tags: { hasSome: post.tags } },
      ],
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/${params.locale}/blog`}
          className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {params.locale === 'pt' ? 'Voltar ao Blog' : 'Back to Blog'}
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((category) => (
            <Link
              key={category}
              href={`/${params.locale}/blog?category=${category}`}
              className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-medium hover:bg-brand-teal hover:text-white transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>{publishedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>
              {post.readingTimeMinutes} {params.locale === 'pt' ? 'min de leitura' : 'min read'}
            </span>
          </div>
          <button className="ml-auto flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{params.locale === 'pt' ? 'Partilhar' : 'Share'}</span>
          </button>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-96 rounded-xl overflow-hidden mb-12">
            <Image
              src={post.featuredImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body - TipTap JSON Renderer */}
        <div className="prose prose-lg max-w-none mb-12">
          <TipTapRenderer content={body} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 py-8 border-t">
            <span className="text-gray-500 font-medium">
              {params.locale === 'pt' ? 'Tags:' : 'Tags:'}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {params.locale === 'pt' ? 'Artigos Relacionados' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost) => {
                const relatedTitle = params.locale === 'pt' ? relatedPost.titlePt : relatedPost.titleEn
                const relatedExcerpt = params.locale === 'pt' ? relatedPost.excerptPt : relatedPost.excerptEn

                return (
                  <Link
                    key={relatedPost.id}
                    href={`/${params.locale}/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {relatedPost.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedTitle}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                          {relatedTitle}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedExcerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {params.locale === 'pt' 
              ? 'Pronto para transformar a sua ideia?' 
              : 'Ready to transform your idea?'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {params.locale === 'pt'
              ? 'Vamos criar algo extraordinário juntos'
              : "Let's create something extraordinary together"}
          </p>
          <Link
            href={`/${params.locale}/contacto`}
            className="inline-block px-8 py-4 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {params.locale === 'pt' ? 'Fale Connosco' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  )
}

// Simple TipTap JSON renderer component
function TipTapRenderer({ content }: { content: any }) {
  if (!content || typeof content !== 'object') {
    return <div className="text-gray-500">No content available</div>
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node.type) return null

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </p>
        )
      case 'heading':
        const HeadingTag = `h${node.attrs?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </HeadingTag>
        )
      case 'text':
        let text = node.text
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') {
              text = <strong key={index}>{text}</strong>
            } else if (mark.type === 'italic') {
              text = <em key={index}>{text}</em>
            } else if (mark.type === 'link') {
              text = (
                <a key={index} href={mark.attrs?.href} className="text-brand-teal hover:text-brand-orange">
                  {text}
                </a>
              )
            }
          })
        }
        return text
      case 'bulletList':
        return (
          <ul key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ul>
        )
      case 'orderedList':
        return (
          <ol key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ol>
        )
      case 'listItem':
        return (
          <li key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </li>
        )
      case 'codeBlock':
        return (
          <pre key={index}>
            <code>{node.content?.[0]?.text}</code>
          </pre>
        )
      case 'image':
        return (
          <img
            key={index}
            src={node.attrs?.src}
            alt={node.attrs?.alt || ''}
            className="rounded-lg"
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {content.content?.map((node: any, index: number) => renderNode(node, index))}
    </div>
  )
}
