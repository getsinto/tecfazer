import { Metadata } from 'next'
import { db } from './db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface BuildMetadataParams {
  locale: string
  titlePt?: string
  titleEn?: string
  descPt?: string
  descEn?: string
  image?: string
  path?: string
}

export async function buildMetadata(params: BuildMetadataParams): Promise<Metadata> {
  const { locale, titlePt, titleEn, descPt, descEn, image, path } = params

  // Check for page-specific overrides (with graceful fallback if DB not available)
  let pageMeta = null
  if (path) {
    try {
      pageMeta = await db.pageMeta.findUnique({
        where: { path },
      })
    } catch (error) {
      // Database not available - continue with defaults
      console.warn('Database not available for SEO metadata, using defaults')
    }
  }

  const title = locale === 'pt' 
    ? (pageMeta?.titlePt || titlePt || 'Tec Fazer')
    : (pageMeta?.titleEn || titleEn || 'Tec Fazer')

  const description = locale === 'pt'
    ? (pageMeta?.descriptionPt || descPt || 'Empresa de tecnologia em Portugal')
    : (pageMeta?.descriptionEn || descEn || 'Technology company in Portugal')

  const ogImage = pageMeta?.ogImage || image || `${SITE_URL}/images/logo.png`

  return {
    title: {
      default: title,
      template: '%s | Tec Fazer',
    },
    description,
    openGraph: {
      title,
      description,
      url: path ? `${SITE_URL}${path}` : SITE_URL,
      siteName: 'Tec Fazer',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'pt' ? 'pt_PT' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: path ? `${SITE_URL}${path}` : SITE_URL,
      languages: {
        'pt': `${SITE_URL}/pt${path || ''}`,
        'en': `${SITE_URL}/en${path || ''}`,
      },
    },
    robots: {
      index: pageMeta?.noIndex ? false : true,
      follow: pageMeta?.noIndex ? false : true,
    },
  }
}
