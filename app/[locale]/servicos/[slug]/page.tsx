import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ArrowUpRight, Mail, Phone, Star, Shield, Zap, Users } from 'lucide-react'
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
    titlePt: `${service.title} | Comprar Online | Tec Fazer`,
    titleEn: `${service.title} | Buy Online | Tec Fazer`,
    descPt: `${service.description} ${service.fullDescription || ''} Preco: ${service.price}. Compre online com pagamento seguro.`,
    descEn: `${service.description} ${service.fullDescription || ''} Price: ${service.price}. Buy online with secure payment.`,
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
      <section className="relative overflow-hidden bg-[#0a0f1e] pb-0 pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1B7A8A]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-40 h-[400px] w-[400px] rounded-full bg-[#F5A623]/15 blur-[100px]" />

        <div className="container relative mx-auto px-4 sm:px-6">
          {/* breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-white/40 flex-wrap">
            <Link href={`/${locale}/servicos`} className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              {isPt ? 'Servicos' : 'Services'}
            </Link>
            <span>/</span>
            <span className="text-white/60 hidden sm:inline">{category.title}</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-white/80 truncate max-w-[200px]">{service.title}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px] pb-0">
            {/* ── LEFT: title + info ── */}
            <div className="pb-10 lg:pb-16">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 backdrop-blur-sm">
                <category.icon className="h-3.5 w-3.5" />
                {category.title}
              </div>
              <h1 className="mb-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
                {service.fullDescription || service.description}
              </p>

              {/* quick stats */}
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: Clock, label: isPt ? 'Prazo' : 'Timeline', value: service.timeline || (isPt ? 'A definir' : 'TBD') },
                  { icon: Shield, label: isPt ? 'Suporte' : 'Support', value: service.support ? service.support.split(' ').slice(0, 3).join(' ') : (isPt ? 'Incluido' : 'Included') },
                  { icon: Star, label: isPt ? 'Garantia' : 'Guarantee', value: isPt ? '30 dias' : '30 days' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5 text-[#1B7A8A]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* tech pills */}
              <div className="flex flex-wrap gap-2">
                {service.technologies.map(t => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: purchase card ── */}
            <div className="lg:pt-2">
              <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                {/* card header */}
                <div className="bg-gradient-to-r from-[#1B7A8A]/30 to-[#F5A623]/20 px-6 py-5 border-b border-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                    {isPt ? 'Investimento' : 'Investment'}
                  </p>
                  <p className="text-3xl font-black text-white">{service.price}</p>
                  {service.timeline && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-white/50">
                      <Clock className="h-3.5 w-3.5" />
                      {service.timeline}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  {/* PRIMARY: Buy Now */}
                  <BuyServiceButton
                    serviceSlug={service.slug}
                    serviceTitle={service.title}
                    serviceDescription={service.description}
                    priceText={service.price}
                    locale={locale}
                    variant="white"
                    size="lg"
                    className="w-full"
                  />

                  {/* SECONDARY: Request Quote */}
                  <Link href={`/${locale}/contacto?service=${service.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/15 hover:border-white/40">
                    <Mail className="h-4 w-4" />
                    {isPt ? 'Solicitar Orcamento' : 'Request Quote'}
                  </Link>

                  {/* TERTIARY: Calculator */}
                  <Link href={`/${locale}/orcamento?service=${service.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent py-2.5 text-xs font-semibold text-white/40 transition-all hover:text-white/60 hover:border-white/20">
                    {isPt ? 'Calcular Preco Personalizado' : 'Calculate Custom Price'}
                  </Link>

                  {/* trust signals */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    {[
                      { icon: CheckCircle2, text: isPt ? 'Consulta gratuita de 30 minutos' : 'Free 30-minute consultation' },
                      { icon: Zap, text: isPt ? 'Resposta garantida em 24h' : 'Guaranteed response in 24h' },
                      { icon: Shield, text: isPt ? 'Pagamento 100% seguro via Stripe' : '100% secure payment via Stripe' },
                      { icon: Users, text: isPt ? 'Equipa dedicada ao seu projeto' : 'Dedicated team for your project' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs text-white/40">
                        <Icon className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>

                  {/* contact direct */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-white/30 text-center mb-2 uppercase tracking-widest">
                      {isPt ? 'Ou contacte diretamente' : 'Or contact directly'}
                    </p>
                    <div className="flex gap-2">
                      <a href="tel:+351963101123"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white/80 transition-all">
                        <Phone className="h-3.5 w-3.5" />
                        {isPt ? 'Ligar' : 'Call'}
                      </a>
                      <a href="https://wa.me/351963101123"
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom fade */}
        <div className="h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── FEATURES + BENEFITS ──────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">

            {/* Features */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'O que esta incluido' : 'What is included'}
              </p>
              <h2 className="mb-7 text-2xl font-black text-slate-900 sm:text-3xl">
                {isPt ? 'Funcionalidades' : 'Features'}
              </h2>
              <div className="space-y-2.5">
                {service.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-5 py-3.5 transition-colors hover:border-[#1B7A8A]/20 hover:bg-[#1B7A8A]/5">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {service.benefits && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F5A623]">
                  {isPt ? 'Por que escolher' : 'Why choose this'}
                </p>
                <h2 className="mb-7 text-2xl font-black text-slate-900 sm:text-3xl">
                  {isPt ? 'Beneficios' : 'Benefits'}
                </h2>
                <div className="space-y-2.5">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white px-5 py-3.5 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1B7A8A]/10">
                        <span className="text-xs font-black text-[#1B7A8A]">{i + 1}</span>
                      </div>
                      <span className="font-medium text-slate-800 text-sm">{b}</span>
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
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Como trabalhamos' : 'How we work'}
              </p>
              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {isPt ? 'Processo de Trabalho' : 'Work Process'}
              </h2>
            </div>
            <div className="mx-auto max-w-2xl space-y-3">
              {service.process.map((step, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0a0f1e] text-white font-black text-sm shadow-md">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-slate-900 text-sm">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DELIVERABLES + SUPPORT ───────────────────────────── */}
      {(service.deliverables || service.support) && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {service.deliverables && (
                <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                    {isPt ? 'Entregaveis' : 'Deliverables'}
                  </p>
                  <h3 className="mb-5 text-xl font-black text-slate-900">
                    {isPt ? 'O que vai receber' : 'What you will receive'}
                  </h3>
                  <div className="space-y-2.5">
                    {service.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-700 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1B7A8A] flex-shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {service.support && (
                <div className="rounded-2xl bg-gradient-to-br from-[#0a0f1e] to-[#1a2540] p-6 sm:p-8 text-white">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                    {isPt ? 'Suporte' : 'Support'}
                  </p>
                  <h3 className="mb-3 text-xl font-black">{isPt ? 'Suporte Incluido' : 'Support Included'}</h3>
                  <p className="mb-4 text-2xl font-black text-[#F5A623]">{service.support}</p>
                  <p className="text-sm leading-relaxed text-white/50">
                    {isPt
                      ? 'Suporte tecnico completo incluido no preco, garantindo o sucesso do seu projeto apos o lancamento.'
                      : 'Complete technical support included in the price, ensuring the success of your project after launch.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── PURCHASE CTA BANNER ──────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0f1e] px-6 py-12 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#1B7A8A]/30 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#F5A623]/20 blur-[80px]" />
            <div className="relative">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/30">
                    {isPt ? 'Pronto para comecar?' : 'Ready to get started?'}
                  </p>
                  <h2 className="mb-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">
                    {isPt ? `Comprar ${service.title}` : `Buy ${service.title}`}
                  </h2>
                  <p className="text-white/50 text-sm sm:text-base max-w-lg">
                    {isPt
                      ? 'Compre diretamente online com pagamento seguro, ou solicite um orcamento personalizado. Resposta garantida em 24h.'
                      : 'Buy directly online with secure payment, or request a custom quote. Guaranteed response within 24h.'}
                  </p>
                  <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-black text-white">{service.price}</span>
                    {service.timeline && (
                      <span className="flex items-center gap-1.5 text-sm text-white/40">
                        <Clock className="h-4 w-4" />
                        {service.timeline}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row min-w-[240px]">
                  <BuyServiceButton
                    serviceSlug={service.slug}
                    serviceTitle={service.title}
                    serviceDescription={service.description}
                    priceText={service.price}
                    locale={locale}
                    variant="white"
                    size="lg"
                    className="w-full sm:w-auto lg:w-full xl:w-auto"
                  />
                  <Link href={`/${locale}/contacto?service=${service.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:border-white/40 whitespace-nowrap">
                    <Phone className="h-4 w-4" />
                    {isPt ? 'Falar Connosco' : 'Contact Us'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED SERVICES ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              {isPt ? 'Da mesma categoria' : 'From the same category'}
            </p>
            <h2 className="mb-8 text-2xl font-black text-slate-900">
              {isPt ? 'Servicos Relacionados' : 'Related Services'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(s => (
                <Link key={s.slug} href={`/${locale}/servicos/${s.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#1B7A8A]/30 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-xs font-bold text-[#1B7A8A]">{s.price}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#1B7A8A]" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-900 group-hover:text-[#1B7A8A] transition-colors text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">{s.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-[#1B7A8A]">
                    {isPt ? 'Ver detalhes' : 'View details'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
