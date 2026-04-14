import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SectionReveal from '@/components/ui/SectionReveal'
import { ArrowRight, Code, Smartphone, Cloud, Palette, TrendingUp, Brain, Shield, Wrench, Headphones } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return buildMetadata({
    locale,
    titlePt: 'Serviços',
    titleEn: 'Services',
    descPt: 'Descubra os nossos serviços de desenvolvimento web, mobile, cloud, design e marketing digital.',
    descEn: 'Discover our web, mobile, cloud development, design and digital marketing services.',
    path: `/${locale}/servicos`,
  })
}

const categoryIcons: Record<string, any> = {
  development: Code,
  mobile: Smartphone,
  cloud: Cloud,
  design: Palette,
  marketing: TrendingUp,
  ai: Brain,
  security: Shield,
  specialized: Wrench,
  support: Headphones,
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('services')

  // Fetch services from database (with graceful fallback)
  let services: any[] = []
  try {
    services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
    // Return empty state - will show "no services" message
  }

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof services>)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-brand-teal/5 py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-block rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur">
                {t('sectionBadge')}
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('sectionTitle')}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                {t('sectionSubtitle')}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {Object.entries(servicesByCategory).map(([category, categoryServices], categoryIndex) => {
            const Icon = categoryIcons[category] || Code

            return (
              <div key={category} className="mb-16 last:mb-0">
                <SectionReveal delay={categoryIndex * 0.1}>
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      {t(`categories.${category}` as any)}
                    </h2>
                  </div>
                </SectionReveal>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(categoryServices as any[]).map((service: any, index: number) => (
                    <SectionReveal key={service.id} delay={categoryIndex * 0.1 + index * 0.05}>
                      <Card className="group h-full transition-all hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="line-clamp-2">
                            {locale === 'pt' ? service.titlePt : service.titleEn}
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {locale === 'pt' ? service.shortDescPt : service.shortDescEn}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 flex flex-wrap gap-2">
                            {service.technologies.slice(0, 3).map((tech: string) => (
                              <span
                                key={tech}
                                className="rounded-full bg-brand-teal/10 px-2 py-1 text-xs font-medium text-brand-teal"
                              >
                                {tech}
                              </span>
                            ))}
                            {service.technologies.length > 3 && (
                              <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                +{service.technologies.length - 3}
                              </span>
                            )}
                          </div>
                          <Button asChild variant="ghost" className="group-hover:text-brand-teal">
                            <Link href={`/${locale}/servicos/${service.slug}`}>
                              {t('learnMore')}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </SectionReveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-teal to-brand-orange py-20 text-white">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {locale === 'pt'
                  ? 'Não Encontrou o Que Procura?'
                  : "Didn't Find What You're Looking For?"}
              </h2>
              <p className="mb-8 text-lg text-white/90">
                {locale === 'pt'
                  ? 'Contacte-nos para discutir as suas necessidades específicas.'
                  : 'Contact us to discuss your specific needs.'}
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/${locale}/contacto`}>
                  {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                </Link>
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
