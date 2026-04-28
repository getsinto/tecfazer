import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SectionReveal from '@/components/ui/SectionReveal'
import { 
  ArrowRight, CheckCircle2, Clock, Euro, Star, Award, Shield, 
  Zap, Users, FileText, Calendar, Phone, Mail, ArrowLeft,
  Target, Lightbulb, Cog, Truck, HeadphonesIcon
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData, type ServiceItem } from '@/lib/services-data'

export const dynamic = 'force-dynamic'

// Generate static params for all service slugs
export async function generateStaticParams() {
  const allSlugs: { locale: string; slug: string }[] = []
  
  Object.entries(servicesData).forEach(([locale, categories]) => {
    Object.values(categories).forEach(category => {
      category.services.forEach(service => {
        allSlugs.push({ locale, slug: service.slug })
      })
    })
  })
  
  return allSlugs
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const service = findServiceBySlug(locale, slug)
  
  if (!service) {
    return buildMetadata({
      locale,
      titlePt: 'Serviço não encontrado',
      titleEn: 'Service not found',
      descPt: 'O serviço solicitado não foi encontrado.',
      descEn: 'The requested service was not found.',
      path: `/${locale}/servicos/${slug}`,
    })
  }

  return buildMetadata({
    locale,
    titlePt: `${service.title} | Tec Fazer - ${service.price}`,
    titleEn: `${service.title} | Tec Fazer - ${service.price}`,
    descPt: `${service.description} ${service.fullDescription || ''} Preço: ${service.price}. ISO 9001 certificado.`,
    descEn: `${service.description} ${service.fullDescription || ''} Price: ${service.price}. ISO 9001 certified.`,
    path: `/${locale}/servicos/${slug}`,
  })
}

function findServiceBySlug(locale: string, slug: string): ServiceItem | null {
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en
  
  for (const category of Object.values(services)) {
    const service = category.services.find(s => s.slug === slug)
    if (service) return service
  }
  
  return null
}

function findCategoryByServiceSlug(locale: string, slug: string) {
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en
  
  for (const [categoryKey, category] of Object.entries(services)) {
    const service = category.services.find(s => s.slug === slug)
    if (service) return { categoryKey, category }
  }
  
  return null
}

export default async function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const service = findServiceBySlug(locale, slug)
  const categoryInfo = findCategoryByServiceSlug(locale, slug)
  
  if (!service || !categoryInfo) {
    notFound()
  }

  const { category } = categoryInfo

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${category.color} py-32`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl">
              {/* Breadcrumb */}
              <div className="mb-8">
                <Link 
                  href={`/${locale}/servicos`}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {locale === 'pt' ? 'Voltar aos Serviços' : 'Back to Services'}
                </Link>
              </div>

              <div className="text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </div>
                
                <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
                  {service.title}
                </h1>
                
                <p className="text-xl text-white/90 md:text-2xl mb-8 max-w-3xl mx-auto">
                  {service.fullDescription || service.description}
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                    {service.price}
                  </Badge>
                  {service.timeline && (
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                      <Clock className="h-4 w-4 mr-2" />
                      {service.timeline}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8 py-6 text-lg">
                    <Link href={`/${locale}/contacto?service=${service.slug}`}>
                      {locale === 'pt' ? 'Solicitar Orçamento' : 'Request Quote'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                    <Link href={`/${locale}/orcamento?service=${service.slug}`}>
                      {locale === 'pt' ? 'Calcular Preço' : 'Calculate Price'}
                      <Euro className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Features & Benefits */}
            <div className="space-y-8">
              <SectionReveal>
                <div>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    {locale === 'pt' ? 'Funcionalidades Incluídas' : 'Included Features'}
                  </h2>
                  <div className="grid gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              {service.benefits && (
                <SectionReveal delay={0.1}>
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <Target className="h-8 w-8 text-brand-teal" />
                      {locale === 'pt' ? 'Benefícios para o Seu Negócio' : 'Benefits for Your Business'}
                    </h2>
                    <div className="grid gap-4">
                      {service.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-brand-teal/5 border border-brand-teal/20">
                          <Star className="h-5 w-5 text-brand-teal flex-shrink-0" />
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              )}
            </div>

            {/* Technologies & Process */}
            <div className="space-y-8">
              <SectionReveal>
                <div>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Cog className="h-8 w-8 text-brand-orange" />
                    {locale === 'pt' ? 'Tecnologias Utilizadas' : 'Technologies Used'}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              {service.process && (
                <SectionReveal delay={0.1}>
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <Lightbulb className="h-8 w-8 text-yellow-500" />
                      {locale === 'pt' ? 'Processo de Desenvolvimento' : 'Development Process'}
                    </h2>
                    <div className="space-y-4">
                      {service.process.map((step, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables & Support */}
      {(service.deliverables || service.support) && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {service.deliverables && (
                <SectionReveal>
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <Truck className="h-8 w-8 text-blue-500" />
                      {locale === 'pt' ? 'O Que Vai Receber' : 'What You Will Receive'}
                    </h2>
                    <div className="space-y-4">
                      {service.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm">
                          <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              )}

              {service.support && (
                <SectionReveal delay={0.1}>
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <HeadphonesIcon className="h-8 w-8 text-purple-500" />
                      {locale === 'pt' ? 'Suporte Incluído' : 'Support Included'}
                    </h2>
                    <div className="p-6 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-6 w-6 text-purple-500" />
                        <span className="font-bold text-lg">{service.support}</span>
                      </div>
                      <p className="text-muted-foreground">
                        {locale === 'pt' 
                          ? 'Suporte técnico completo incluído no preço, garantindo o sucesso do seu projeto.'
                          : 'Complete technical support included in the price, ensuring the success of your project.'}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {locale === 'pt'
                  ? 'Pronto para Começar?'
                  : 'Ready to Get Started?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {locale === 'pt'
                  ? 'Vamos discutir como este serviço pode transformar o seu negócio'
                  : "Let's discuss how this service can transform your business"}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white px-8 py-6 text-lg">
                  <Link href={`/${locale}/contacto?service=${service.slug}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <Link href={`mailto:info@tecfazer.pt?subject=${encodeURIComponent(`${locale === 'pt' ? 'Interesse em' : 'Interest in'} ${service.title}`)}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    {locale === 'pt' ? 'Enviar Email' : 'Send Email'}
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <span>✓ {locale === 'pt' ? 'Consulta gratuita 30min' : 'Free 30min consultation'}</span>
                <span>✓ {locale === 'pt' ? 'Resposta em 24h' : 'Response within 24h'}</span>
                <span>✓ {locale === 'pt' ? 'Orçamento personalizado' : 'Custom quote'}</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}