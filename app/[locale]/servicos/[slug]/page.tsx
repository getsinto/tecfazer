import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronDown } from 'lucide-react'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const service = await db.service.findUnique({
    where: { slug: params.slug },
  })

  if (!service) return {}

  return buildMetadata({
    locale: params.locale,
    titlePt: service.metaTitlePt || `${service.titlePt} | Tec Fazer`,
    titleEn: service.metaTitleEn || `${service.titleEn} | Tec Fazer`,
    descPt: service.metaDescPt || service.shortDescPt,
    descEn: service.metaDescEn || service.shortDescEn,
    path: `/servicos/${params.slug}`,
    image: service.featuredImage || undefined,
  })
}

export async function generateStaticParams() {
  // Return empty array to prevent static generation at build time
  // Pages will be generated dynamically at request time
  return []
}

export default async function ServiceDetailPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const service = await db.service.findUnique({
    where: { slug: params.slug },
  })

  if (!service || !service.isActive) notFound()

  const title = params.locale === 'pt' ? service.titlePt : service.titleEn
  const shortDesc = params.locale === 'pt' ? service.shortDescPt : service.shortDescEn
  const fullDesc = params.locale === 'pt' ? service.fullDescPt : service.fullDescEn
  
  // Parse process steps and FAQs from JSON
  const processSteps = service.processSteps as any[]
  const faqs = service.faqs as any[]

  // Fetch related services
  const relatedServices = await db.service.findMany({
    where: {
      isActive: true,
      category: service.category,
      id: { not: service.id },
    },
    take: 3,
  }).catch(() => [])

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/${params.locale}/servicos`}
          className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {params.locale === 'pt' ? 'Voltar aos Serviços' : 'Back to Services'}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-orange/10" />
        {service.featuredImage && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={service.featuredImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-brand-teal/20 rounded-full text-brand-teal font-medium mb-6">
              {service.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {shortDesc}
            </p>
            <Link
              href={`/${params.locale}/contacto?service=${service.slug}`}
              className="inline-block px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {params.locale === 'pt' ? 'Solicitar Orçamento' : 'Request Quote'}
            </Link>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fullDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Technologies */}
      {service.technologies.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {params.locale === 'pt' ? 'Tecnologias Utilizadas' : 'Technologies Used'}
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {service.technologies.map((tech) => (
                <div
                  key={tech}
                  className="px-6 py-3 bg-white rounded-lg shadow-md font-medium text-gray-700 hover:shadow-lg transition-shadow"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {processSteps && processSteps.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {params.locale === 'pt' ? 'Nosso Processo' : 'Our Process'}
            </h2>
            <div className="space-y-8">
              {processSteps.map((step: any, index: number) => {
                const stepTitle = params.locale === 'pt' ? step.titlePt : step.titleEn
                const stepDesc = params.locale === 'pt' ? step.descriptionPt : step.descriptionEn

                return (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-teal to-brand-orange text-white flex items-center justify-center text-xl font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{stepTitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{stepDesc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {params.locale === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq: any, index: number) => {
                const question = params.locale === 'pt' ? faq.questionPt : faq.questionEn
                const answer = params.locale === 'pt' ? faq.answerPt : faq.answerEn

                return (
                  <details
                    key={index}
                    className="group bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="font-bold text-lg">{question}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {answer}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {params.locale === 'pt' ? 'Serviços Relacionados' : 'Related Services'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedServices.map((relatedService) => {
                const relatedTitle = params.locale === 'pt' ? relatedService.titlePt : relatedService.titleEn
                const relatedDesc = params.locale === 'pt' ? relatedService.shortDescPt : relatedService.shortDescEn

                return (
                  <Link
                    key={relatedService.id}
                    href={`/${params.locale}/servicos/${relatedService.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="text-4xl mb-4">{relatedService.icon}</div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-teal transition-colors">
                        {relatedTitle}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {relatedDesc}
                      </p>
                    </div>
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
              ? 'Interessado neste serviço?' 
              : 'Interested in this service?'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {params.locale === 'pt'
              ? 'Entre em contacto connosco para discutir o seu projeto'
              : 'Get in touch with us to discuss your project'}
          </p>
          <Link
            href={`/${params.locale}/contacto?service=${service.slug}`}
            className="inline-block px-8 py-4 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {params.locale === 'pt' ? 'Fale Connosco' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  )
}
