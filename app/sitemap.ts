import { MetadataRoute } from 'next'
import { getDbClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt'
  const locales = ['pt', 'en']

  try {
    const db = getDbClient()

    // Fetch dynamic content
    const [blogPosts, projects, services] = await Promise.all([
      db.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      db.project.findMany({
        select: { slug: true, updatedAt: true },
      }),
      db.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    // Static pages
    const staticPages = [
      '',
      '/sobre',
      '/servicos',
      '/portfolio',
      '/blog',
      '/precos',
      '/contacto',
      '/orcamento',
      '/deixar-avaliacao',
      '/privacidade',
      '/termos',
    ]

    const staticUrls: MetadataRoute.Sitemap = []
    for (const locale of locales) {
      for (const page of staticPages) {
        staticUrls.push({
          url: `${baseUrl}/${locale}${page}`,
          lastModified: new Date(),
          changeFrequency: page === '' ? 'daily' : 'weekly',
          priority: page === '' ? 1 : 0.8,
        })
      }
    }

    // Blog posts
    const blogUrls: MetadataRoute.Sitemap = []
    for (const locale of locales) {
      for (const post of blogPosts) {
        blogUrls.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }

    // Projects
    const projectUrls: MetadataRoute.Sitemap = []
    for (const locale of locales) {
      for (const project of projects) {
        projectUrls.push({
          url: `${baseUrl}/${locale}/portfolio/${project.slug}`,
          lastModified: project.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }

    // Services
    const serviceUrls: MetadataRoute.Sitemap = []
    for (const locale of locales) {
      for (const service of services) {
        serviceUrls.push({
          url: `${baseUrl}/${locale}/servicos/${service.slug}`,
          lastModified: service.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    }

    return [...staticUrls, ...blogUrls, ...projectUrls, ...serviceUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to static pages only if database fails
    const fallbackUrls: MetadataRoute.Sitemap = []
    const staticPages = [
      '',
      '/sobre',
      '/servicos',
      '/portfolio',
      '/blog',
      '/precos',
      '/contacto',
      '/orcamento',
      '/deixar-avaliacao',
      '/privacidade',
      '/termos',
    ]

    for (const locale of locales) {
      for (const page of staticPages) {
        fallbackUrls.push({
          url: `${baseUrl}/${locale}${page}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: page === '' ? 1 : 0.8,
        })
      }
    }

    return fallbackUrls
  }
}
