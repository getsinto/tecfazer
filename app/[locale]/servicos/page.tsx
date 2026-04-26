import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getDbClient } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SectionReveal from '@/components/ui/SectionReveal'
import { ArrowRight, Code, Smartphone, Cloud, Palette, TrendingUp, Brain, Shield, Wrench, Headphones, Sparkles, Zap, CheckCircle2 } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

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

const categoryColors: Record<string, string> = {
  development: 'from-blue-500 to-cyan-500',
  mobile: 'from-purple-500 to-pink-500',
  cloud: 'from-sky-500 to-blue-500',
  design: 'from-orange-500 to-red-500',
  marketing: 'from-green-500 to-emerald-500',
  ai: 'from-violet-500 to-purple-500',
  security: 'from-red-500 to-rose-500',
  specialized: 'from-amber-500 to-orange-500',
  support: 'from-teal-500 to-cyan-500',
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('services')

  let services: any[] = []
  try {
    const db = getDbClient()
    services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
  }

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof services>)

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
                <Sparkles className="h-4 w-4" />
                {locale === 'pt' ? 'Soluções Completas' : 'Complete Solutions'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {t('sectionTitle')}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl">
                {t('sectionSubtitle')}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {Object.entries(servicesByCategory).length > 0 ? (
            Object.entries(servicesByCategory).map(([category, categoryServices], categoryIndex) => {
              const Icon = categoryIcons[category] || Code
              const gradientColor = categoryColors[category] || 'from-brand-teal to-brand-orange'

              return (
                <div key={category} className="mb-24 last:mb-0">
                  <SectionReveal delay={categoryIndex * 0.1}>
                    <div className="mb-12 text-center">
                      <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientColor} shadow-xl`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold">
                        {t(`categories.${category}` as any)}
                      </h2>
                    </div>
                  </SectionReveal>

                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {(categoryServices as any[]).map((service: any, index: number) => (
                      <SectionReveal key={service.id} delay={categoryIndex * 0.1 + index * 0.05}>
                        <Card className="group h-full overflow-hidden border-0 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                          <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl line-clamp-2 group-hover:text-brand-teal transition-colors">
                              {locale === 'pt' ? service.titlePt : service.titleEn}
                            </CardTitle>
                            <CardDescription className="line-clamp-3 text-base">
                              {locale === 'pt' ? service.shortDescPt : service.shortDescEn}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-6 flex flex-wrap gap-2">
                              {service.technologies.slice(0, 4).map((tech: string) => (
                                <span
                                  key={tech}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                >
                                  {tech}
                                </span>
                              ))}
                              {service.technologies.length > 4 && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                  +{service.technologies.length - 4}
                                </span>
                              )}
                            </div>
                            <Button asChild variant="ghost" className="group/btn w-full justify-between hover:bg-brand-teal/10 hover:text-brand-teal">
                              <Link href={`/${locale}/servicos/${service.slug}`}>
                                {t('learnMore')}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </SectionReveal>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl bg-slate-50 p-16 text-center">
              <Code className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Os nossos serviços estarão disponíveis em breve'
                  : 'Our services will be available soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {locale === 'pt' ? 'Porquê Escolher-nos?' : 'Why Choose Us?'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Combinamos experiência, tecnologia e dedicação para entregar resultados excepcionais'
                  : 'We combine experience, technology and dedication to deliver exceptional results'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: locale === 'pt' ? 'Entrega Rápida' : 'Fast Delivery', desc: locale === 'pt' ? 'Projetos entregues no prazo' : 'Projects delivered on time' },
              { icon: CheckCircle2, title: locale === 'pt' ? 'Qualidade Garantida' : 'Quality Assured', desc: locale === 'pt' ? 'Código limpo e testado' : 'Clean and tested code' },
              { icon: Headphones, title: locale === 'pt' ? 'Suporte 24/7' : '24/7 Support', desc: locale === 'pt' ? 'Sempre disponíveis' : 'Always available' },
              { icon: Shield, title: locale === 'pt' ? 'Segurança' : 'Security', desc: locale === 'pt' ? 'Proteção de dados' : 'Data protection' },
            ].map((item, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange shadow-lg">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {locale === 'pt'
                  ? 'Pronto para Começar?'
                  : 'Ready to Get Started?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {locale === 'pt'
                  ? 'Vamos transformar a sua visão em realidade digital'
                  : "Let's transform your vision into digital reality"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-brand-teal hover:bg-white/90">
                  <Link href={`/${locale}/contacto`}>
                    {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href={`/${locale}/orcamento`}>
                    {locale === 'pt' ? 'Calcular Orçamento' : 'Calculate Budget'}
                  </Link>
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
