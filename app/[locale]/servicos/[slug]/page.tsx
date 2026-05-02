import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ArrowUpRight, Mail, Phone } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData, type ServiceItem } from '@/lib/services-data'
import BuyServiceButton from '@/components/services/BuyServiceButton'

export const dynamic = 'force-dynamic'

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

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const service = findServiceBySlug(locale, slug)
  if (!service) return {}
  return buildMetadata({
    locale,
    titlePt: `${service.title} | Tec Fazer`,
    titleEn: `${service.title} | Tec Fazer`,
    descPt: `${service.description} ${service.fullDescription || ''} Preco: ${service.price}.`,
    descEn: `${service.description} ${service.fullDescription || ''} Price: ${service.price}.`,
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

function getRelatedServices(locale: string, slug: string, limit = 3) {
  const info = findCategoryByServiceSlug(locale, slug)
  if (!info) return []
  return info.category.services.filter(s => s.slug !== slug).slice(0, limit)
}

export default async function ServiceDetailPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const service = findServiceBySlug(locale, slug)
  const categoryInfo = findCategoryByServiceSlug(locale, slug)
  if (!service || !categoryInfo) notFound()

  const { category } = categoryInfo
  const related = getRelatedServices(locale, slug)
  const isPt = locale === 'pt'

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] pb-0 pt-28">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1B7A8A]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-40 h-[400px] w-[400px] rounded-full bg-[#F5A623]/15 blur-[100px]" />

        <div className="container relative mx-auto px-6">
          {/* breadcrumb */}
          <div className="mb-10 flex items-center gap-2 text-sm text-white/40">
            <Link href={`/${locale}/servicos`} className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              {isPt ? 'Serviços' : 'Services'}
            </Link>
            <span>/</span>
            <span className="text-white/60">{category.title}</span>
            <span>/</span>
            <span className="text-white/80">{service.title}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_360px] pb-16">
            {/* left: title block */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
                <category.icon className="h-3.5 w-3.5" />
                {category.title}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/55">
                {service.fullDescription || service.description}
              </p>

              {/* tech pills */}
              <div className="flex flex-wrap gap-2">
                {service.technologies.map(t => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* right: pricing card */}
            <div className="lg:pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/40">
                  {isPt ? 'Investimento' : 'Investment'}
                </p>
                <p className="mb-6 text-3xl font-bold text-white">{service.price}</p>

                {service.timeline && (
                  <div className="mb-6 flex items-center gap-2 text-sm text-white/50">
                    <Clock className="h-4 w-4" />
                    {service.timeline}
                  </div>
                )}

                <BuyServiceButton
                  serviceSlug={service.slug}
                  serviceTitle={service.title}
                  serviceDescription={service.description}
                  priceText={service.price}
                  locale={locale}
                  variant="white"
                  size="lg"
                  className="mb-3 w-full"
                />
                <Link href={`/${locale}/contacto?service=${service.slug}`}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">
                  {isPt ? 'Solicitar Orçamento' : 'Request Quote'}
                </Link>
                <Link href={`/${locale}/orcamento?service=${service.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10">
                  {isPt ? 'Calcular Preço' : 'Calculate Price'}
                </Link>

                <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
                  {[
                    isPt ? 'Consulta gratuita 30min' : 'Free 30min consultation',
                    isPt ? 'Resposta em 24h' : 'Response within 24h',
                    isPt ? 'Sem compromisso' : 'No commitment',
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-white/40">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom fade */}
        <div className="h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">

            {/* Features */}
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'O que está incluído' : 'What is included'}
              </p>
              <h2 className="mb-8 text-2xl font-bold text-slate-900">
                {isPt ? 'Funcionalidades' : 'Features'}
              </h2>
              <div className="space-y-3">
                {service.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 transition-colors hover:border-slate-200">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="font-medium text-slate-800">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {service.benefits && (
              <div>
                <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
                  {isPt ? 'Por que escolher' : 'Why choose this'}
                </p>
                <h2 className="mb-8 text-2xl font-bold text-slate-900">
                  {isPt ? 'Benefícios' : 'Benefits'}
                </h2>
                <div className="space-y-3">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1B7A8A]/10">
                        <span className="text-sm font-bold text-[#1B7A8A]">{i + 1}</span>
                      </div>
                      <span className="font-medium text-slate-800">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      {service.process && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Como trabalhamos' : 'How we work'}
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                {isPt ? 'Processo de Trabalho' : 'Work Process'}
              </h2>
            </div>
            <div className="relative mx-auto max-w-3xl">
              {/* vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 lg:left-1/2" />
              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* dot */}
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0f1e] text-white font-bold shadow-lg lg:mx-auto">
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${i % 2 === 0 ? 'lg:mr-[calc(50%+24px)]' : 'lg:ml-[calc(50%+24px)]'}`}>
                      <p className="font-semibold text-slate-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── DELIVERABLES + SUPPORT ───────────────────────────── */}
      {(service.deliverables || service.support) && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              {service.deliverables && (
                <div className="rounded-2xl border border-slate-200 p-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1B7A8A]">
                    {isPt ? 'Entregáveis' : 'Deliverables'}
                  </p>
                  <h3 className="mb-6 text-xl font-bold text-slate-900">
                    {isPt ? 'O que vai receber' : 'What you will receive'}
                  </h3>
                  <div className="space-y-3">
                    {service.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1B7A8A] flex-shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {service.support && (
                <div className="rounded-2xl bg-gradient-to-br from-[#0a0f1e] to-[#1a2540] p-8 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                    {isPt ? 'Suporte' : 'Support'}
                  </p>
                  <h3 className="mb-4 text-xl font-bold">{isPt ? 'Suporte Incluído' : 'Support Included'}</h3>
                  <p className="mb-6 text-2xl font-bold text-[#F5A623]">{service.support}</p>
                  <p className="text-sm leading-relaxed text-white/50">
                    {isPt
                      ? 'Suporte técnico completo incluído no preço, garantindo o sucesso do seu projeto após o lançamento.'
                      : 'Complete technical support included in the price, ensuring the success of your project after launch.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED SERVICES ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {isPt ? 'Da mesma categoria' : 'From the same category'}
            </p>
            <h2 className="mb-10 text-2xl font-bold text-slate-900">
              {isPt ? 'Serviços Relacionados' : 'Related Services'}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(s => (
                <Link key={s.slug} href={`/${locale}/servicos/${s.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-xs font-semibold text-slate-400">{s.price}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#1B7A8A]" />
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-[#1B7A8A] transition-colors">{s.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0f1e] px-8 py-16 md:px-16">
            <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#1B7A8A]/30 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#F5A623]/20 blur-[80px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                  {isPt ? `Interessado em ${service.title}?` : `Interested in ${service.title}?`}
                </h2>
                <p className="text-white/50">
                  {isPt ? 'Fale connosco hoje e receba uma proposta personalizada.' : 'Talk to us today and receive a personalized proposal.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link href={`/${locale}/contacto?service=${service.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 whitespace-nowrap">
                  <Phone className="h-4 w-4" />
                  {isPt ? 'Falar Connosco' : 'Contact Us'}
                </Link>
                <Link href={`mailto:info@tecfazer.pt?subject=${encodeURIComponent(`${isPt ? 'Interesse em' : 'Interest in'} ${service.title}`)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 whitespace-nowrap">
                  <Mail className="h-4 w-4" />
                  {isPt ? 'Enviar Email' : 'Send Email'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
