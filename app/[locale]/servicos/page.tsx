import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SectionReveal from '@/components/ui/SectionReveal'
import { ArrowRight, Sparkles, CheckCircle2, Award, Clock, Euro, Users } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData } from '@/lib/services-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return buildMetadata({
    locale,
    titlePt: 'Serviços de Tecnologia | 50+ Serviços Especializados | Tec Fazer',
    titleEn: 'Technology Services | 50+ Specialized Services | Tec Fazer',
    descPt: 'Mais de 50 serviços especializados: desenvolvimento web, mobile, cloud, e-commerce, IA, cibersegurança, marketing digital. Preços desde €200. ISO 9001 certificado.',
    descEn: 'Over 50 specialized services: web development, mobile, cloud, e-commerce, AI, cybersecurity, digital marketing. Prices from €200. ISO 9001 certified.',
    path: `/${locale}/servicos`,
  })
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {locale === 'pt' ? '50+ Serviços Especializados' : '50+ Specialized Services'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {locale === 'pt' ? 'Serviços de Tecnologia' : 'Technology Services'}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl mb-8">
                {locale === 'pt'
                  ? 'Soluções tecnológicas completas para impulsionar o seu negócio. Desde desenvolvimento web até inteligência artificial.'
                  : 'Complete technology solutions to boost your business. From web development to artificial intelligence.'}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2"><Award className="h-4 w-4" /><span>ISO 9001 {locale === 'pt' ? 'Certificado' : 'Certified'}</span></div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>300+ {locale === 'pt' ? 'Projetos' : 'Projects'}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>5 {locale === 'pt' ? 'Anos de Experiência' : 'Years Experience'}</span></div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          {Object.entries(services).map(([categoryKey, category], categoryIndex) => (
            <div key={categoryKey} className="mb-32 last:mb-0">
              <SectionReveal delay={categoryIndex * 0.1}>
                <div className="mb-16 text-center">
                  <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${category.color} shadow-2xl`}>
                    <category.icon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 md:text-5xl">{category.title}</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
                </div>
              </SectionReveal>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, index) => (
                  <SectionReveal key={service.slug} delay={categoryIndex * 0.1 + index * 0.05}>
                    <Card className="group h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white">
                      <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl line-clamp-2 group-hover:text-brand-teal transition-colors flex-1">
                            {service.title}
                          </CardTitle>
                          <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-brand-teal/10 to-brand-orange/10 text-brand-teal border-brand-teal/20 whitespace-nowrap">
                            {service.price}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-3 text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div>
                          <h4 className="font-semibold mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                            {locale === 'pt' ? 'Funcionalidades' : 'Features'}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                            {locale === 'pt' ? 'Tecnologias' : 'Technologies'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {service.technologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs bg-slate-50">{tech}</Badge>
                            ))}
                            {service.technologies.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-slate-50">+{service.technologies.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button asChild className="flex-1 bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white shadow-lg">
                            <Link href={`/${locale}/contacto?service=${service.slug}`}>
                              {locale === 'pt' ? 'Solicitar' : 'Request'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white">
                            <Link href={`/${locale}/servicos/${service.slug}`}>
                              {locale === 'pt' ? 'Ver' : 'View'}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SectionReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-brand-teal to-brand-orange text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            {[
              { number: '50+', label: locale === 'pt' ? 'Serviços Disponíveis' : 'Available Services' },
              { number: '300+', label: locale === 'pt' ? 'Projetos Concluídos' : 'Completed Projects' },
              { number: '106+', label: locale === 'pt' ? 'Clientes Satisfeitos' : 'Happy Clients' },
              { number: '24/7', label: locale === 'pt' ? 'Suporte Disponível' : 'Support Available' },
            ].map((stat, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {locale === 'pt' ? 'Pronto para Transformar o Seu Negócio?' : 'Ready to Transform Your Business?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {locale === 'pt'
                  ? 'Vamos criar soluções tecnológicas que impulsionam o crescimento da sua empresa'
                  : "Let's create technology solutions that drive your company's growth"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white px-8 py-6 text-lg">
                  <Link href={`/${locale}/contacto`}>
                    {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <Link href={`/${locale}/orcamento`}>
                    {locale === 'pt' ? 'Calcular Orçamento' : 'Calculate Budget'}
                    <Euro className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <span>✓ {locale === 'pt' ? 'Consulta gratuita 30min' : 'Free 30min consultation'}</span>
                <span>✓ {locale === 'pt' ? 'Resposta em 24h' : 'Response within 24h'}</span>
                <span>✓ {locale === 'pt' ? 'Orçamento sem compromisso' : 'No-obligation quote'}</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
