import Link from 'next/link'
import Image from 'next/image'
import {
  Code, Smartphone, ShoppingCart, Cloud, Palette, TrendingUp, Brain,
  Shield, Headphones, Briefcase, ArrowRight, ArrowUpRight, CheckCircle2,
  Clock, Star, Users, Award, Zap, Globe, Lock, BarChart3, Cpu, Wrench
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData } from '@/lib/services-data'
import SectionReveal from '@/components/ui/SectionReveal'
import BuyServiceButton from '@/components/services/BuyServiceButton'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return buildMetadata({
    locale,
    titlePt: 'Servicos de Tecnologia | Web, Mobile, Cloud, Design & Marketing | Tec Fazer',
    titleEn: 'Technology Services | Web, Mobile, Cloud, Design & Marketing | Tec Fazer',
    descPt: 'Mais de 50 servicos especializados: desenvolvimento web, WordPress, apps mobile, e-commerce, cloud, design grafico, marketing digital, IA e ciberseguranca. Precos a partir de 50 EUR.',
    descEn: 'Over 50 specialized services: web development, WordPress, mobile apps, e-commerce, cloud, graphic design, digital marketing, AI and cybersecurity. Prices from 50 EUR.',
    path: `/${locale}/servicos`,
  })
}

// Explicit icon map — fixes icons not rendering in server components
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  development: Code,
  mobile:      Smartphone,
  ecommerce:   ShoppingCart,
  cloud:       Cloud,
  design:      Palette,
  marketing:   TrendingUp,
  ai:          Brain,
  security:    Shield,
  consulting:  Briefcase,
  support:     Headphones,
}

// Category visual config
const CATEGORY_CONFIG: Record<string, {
  gradient: string
  lightBg: string
  text: string
  border: string
  badge: string
  navBg: string
  navText: string
  navActiveBg: string
}> = {
  development: {
    gradient: 'from-blue-600 to-cyan-500',
    lightBg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    navBg: 'hover:bg-blue-50',
    navText: 'text-blue-600',
    navActiveBg: 'bg-blue-600',
  },
  mobile: {
    gradient: 'from-purple-600 to-pink-500',
    lightBg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    navBg: 'hover:bg-purple-50',
    navText: 'text-purple-600',
    navActiveBg: 'bg-purple-600',
  },
  ecommerce: {
    gradient: 'from-emerald-600 to-teal-500',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    navBg: 'hover:bg-emerald-50',
    navText: 'text-emerald-600',
    navActiveBg: 'bg-emerald-600',
  },
  cloud: {
    gradient: 'from-sky-600 to-blue-500',
    lightBg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
    navBg: 'hover:bg-sky-50',
    navText: 'text-sky-600',
    navActiveBg: 'bg-sky-600',
  },
  design: {
    gradient: 'from-pink-600 to-rose-500',
    lightBg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
    navBg: 'hover:bg-pink-50',
    navText: 'text-pink-600',
    navActiveBg: 'bg-pink-600',
  },
  marketing: {
    gradient: 'from-orange-500 to-amber-500',
    lightBg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    navBg: 'hover:bg-orange-50',
    navText: 'text-orange-600',
    navActiveBg: 'bg-orange-500',
  },
  ai: {
    gradient: 'from-violet-600 to-purple-500',
    lightBg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    navBg: 'hover:bg-violet-50',
    navText: 'text-violet-600',
    navActiveBg: 'bg-violet-600',
  },
  security: {
    gradient: 'from-red-600 to-rose-500',
    lightBg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    navBg: 'hover:bg-red-50',
    navText: 'text-red-600',
    navActiveBg: 'bg-red-600',
  },
  consulting: {
    gradient: 'from-indigo-600 to-blue-500',
    lightBg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
    navBg: 'hover:bg-indigo-50',
    navText: 'text-indigo-600',
    navActiveBg: 'bg-indigo-600',
  },
  support: {
    gradient: 'from-teal-600 to-cyan-500',
    lightBg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    navBg: 'hover:bg-teal-50',
    navText: 'text-teal-600',
    navActiveBg: 'bg-teal-600',
  },
}

// High-quality Unsplash images for each category
const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  development: {
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop',
    alt: 'Web development code on screen',
  },
  mobile: {
    src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80&auto=format&fit=crop',
    alt: 'Mobile app development on smartphone',
  },
  ecommerce: {
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop',
    alt: 'E-commerce online shopping',
  },
  cloud: {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop',
    alt: 'Cloud computing infrastructure',
  },
  design: {
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop',
    alt: 'Graphic design and visual identity',
  },
  marketing: {
    src: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80&auto=format&fit=crop',
    alt: 'Digital marketing analytics',
  },
  ai: {
    src: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80&auto=format&fit=crop',
    alt: 'Artificial intelligence and machine learning',
  },
  security: {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop',
    alt: 'Cybersecurity and data protection',
  },
  consulting: {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop',
    alt: 'Technology consulting and strategy',
  },
  support: {
    src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80&auto=format&fit=crop',
    alt: 'Technical support and maintenance',
  },
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en
  const categories = Object.entries(services)
  const isPt = locale === 'pt'
  const totalServices = categories.reduce((acc, [, cat]) => acc + cat.services.length, 0)

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060d1f] pt-28 pb-24">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="pointer-events-none absolute -top-60 left-0 h-[700px] w-[700px] rounded-full bg-[#1B7A8A]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-[#F5A623]/15 blur-[100px]" />

        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1B7A8A]" />
              {isPt ? 'Tec Fazer — Servicos' : 'Tec Fazer — Services'}
            </div>
            <h1 className="mb-5 text-5xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[72px]">
              {isPt ? (
                <>Tudo o que o seu negocio<br />
                  <span className="bg-gradient-to-r from-[#1B7A8A] via-[#2ab8cc] to-[#F5A623] bg-clip-text text-transparent">
                    precisa, num so lugar
                  </span>
                </>
              ) : (
                <>Everything your business<br />
                  <span className="bg-gradient-to-r from-[#1B7A8A] via-[#2ab8cc] to-[#F5A623] bg-clip-text text-transparent">
                    needs, in one place
                  </span>
                </>
              )}
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/45">
              {isPt
                ? `${totalServices} servicos especializados. Desde um logo a sistemas empresariais completos.`
                : `${totalServices} specialized services. From a logo to complete enterprise systems.`}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/contacto`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#1B7A8A]/25 transition-all hover:scale-105 hover:shadow-2xl">
                {isPt ? 'Consulta Gratuita' : 'Free Consultation'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}/orcamento`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                {isPt ? 'Calcular Orcamento' : 'Get a Quote'}
              </Link>
            </div>
          </div>

          {/* stats */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { icon: Star, n: '300+', l: isPt ? 'Projetos' : 'Projects' },
              { icon: Users, n: '106+', l: isPt ? 'Clientes' : 'Clients' },
              { icon: Award, n: 'ISO 9001', l: isPt ? 'Certificado' : 'Certified' },
              { icon: Zap, n: '24h', l: isPt ? 'Resposta' : 'Response' },
            ].map(({ icon: Icon, n, l }) => (
              <div key={l} className="flex flex-col items-center gap-1 bg-[#060d1f] py-5 px-3">
                <Icon className="mb-1 h-4 w-4 text-[#1B7A8A]" />
                <span className="text-xl font-black text-white">{n}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY NAVIGATION ──────────────────────────────────────── */}
      <nav className="sticky top-16 z-40 border-b border-slate-200/80 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-0 scrollbar-hide">
            {categories.map(([key, cat]) => {
              const Icon = CATEGORY_ICONS[key] || Code
              const cfg = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.development
              return (
                <a key={key} href={`#${key}`}
                  className={`group flex flex-shrink-0 items-center gap-2 border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-slate-500 transition-all hover:border-slate-900 hover:text-slate-900`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${cfg.gradient} shadow-sm`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="whitespace-nowrap">{cat.title}</span>
                </a>
              )
            })}
          </div>
        </div>
      </nav>
      {/* ── ALL CATEGORIES ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6">
        {categories.map(([key, category], catIdx) => {
          const Icon = CATEGORY_ICONS[key] || Code
          const cfg = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.development

          return (
            <section key={key} id={key} className="py-20 scroll-mt-32">
              <SectionReveal>
                {/* ── Category Header with Image ── */}
                <div className="mb-10">
                  {/* Image banner */}
                  <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl sm:h-64 lg:h-72">
                    <Image
                      src={CATEGORY_IMAGES[key]?.src || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop'}
                      alt={CATEGORY_IMAGES[key]?.alt || category.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 1200px"
                      unoptimized
                    />
                    {/* gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${cfg.gradient} opacity-70`} />
                    {/* dark bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* content over image */}
                    <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border border-white/30">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                            {category.services.length} {isPt ? 'servicos' : 'services'}
                          </span>
                          <h2 className="text-2xl font-black text-white drop-shadow-lg sm:text-3xl">{category.title}</h2>
                          <p className="mt-0.5 text-sm text-white/80">{category.description}</p>
                        </div>
                      </div>
                    </div>
                    {/* request proposal button top-right */}
                    <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                      <Link href={`/${locale}/contacto?category=${key}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white hover:text-slate-900">
                        {isPt ? 'Pedir Proposta' : 'Request Proposal'}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SectionReveal>

              {/* ── Service Cards Grid ── */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {category.services.map((service, sIdx) => (
                  <SectionReveal key={service.slug} delay={sIdx * 0.04}>
                    <Link href={`/${locale}/servicos/${service.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl">

                      {/* gradient top bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />

                      <div className="flex flex-1 flex-col p-6">

                        {/* card header */}
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${cfg.lightBg} ${cfg.text} ${cfg.border}`}>
                            {service.price}
                          </span>
                        </div>

                        {/* title */}
                        <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#1B7A8A]">
                          {service.title}
                        </h3>

                        {/* description */}
                        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-500">
                          {service.description}
                        </p>

                        {/* features */}
                        <div className="mb-5 space-y-2">
                          {service.features.slice(0, 3).map(f => (
                            <div key={f} className="flex items-center gap-2.5 text-xs text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                              <span>{f}</span>
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <p className="pl-6 text-xs text-slate-400">
                              +{service.features.length - 3} {isPt ? 'mais' : 'more'}
                            </p>
                          )}
                        </div>

                        {/* tech pills */}
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {service.technologies.slice(0, 4).map(t => (
                            <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{t}</span>
                          ))}
                          {service.technologies.length > 4 && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-400">+{service.technologies.length - 4}</span>
                          )}
                        </div>

                        {/* timeline */}
                        {service.timeline && (
                          <div className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {service.timeline}
                          </div>
                        )}

                        {/* footer cta */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                          <BuyServiceButton
                            serviceSlug={service.slug}
                            serviceTitle={service.title}
                            serviceDescription={service.description}
                            priceText={service.price}
                            locale={locale}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                          />
                          <Link href={`/${locale}/servicos/${service.slug}`}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </Link>
                  </SectionReveal>
                ))}
              </div>

              {/* divider */}
              {catIdx < categories.length - 1 && (
                <div className="mt-20 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              )}
            </section>
          )
        })}
      </div>
      {/* ── WHY TEC FAZER ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Por que nos escolher' : 'Why choose us'}
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                {isPt ? 'Uma empresa, todas as solucoes' : 'One company, all solutions'}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-500">
                {isPt
                  ? 'Nao precisa de contratar multiplas agencias. Temos tudo o que precisa sob um unico teto.'
                  : 'No need to hire multiple agencies. We have everything you need under one roof.'}
              </p>
            </div>
          </SectionReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '🎯', title: isPt ? 'Resultados Reais' : 'Real Results', desc: isPt ? '300+ projetos entregues com sucesso para clientes em Portugal e no mundo.' : '300+ projects successfully delivered for clients in Portugal and worldwide.' },
              { emoji: '⚡', title: isPt ? 'Entrega Rapida' : 'Fast Delivery', desc: isPt ? 'Metodologia agil com entregas rapidas e comunicacao transparente.' : 'Agile methodology with fast deliveries and transparent communication.' },
              { emoji: '🔒', title: isPt ? 'Qualidade Garantida' : 'Quality Guaranteed', desc: isPt ? 'ISO 9001 certificado. Codigo limpo, testado e documentado.' : 'ISO 9001 certified. Clean, tested and documented code.' },
              { emoji: '💬', title: isPt ? 'Suporte Dedicado' : 'Dedicated Support', desc: isPt ? 'Suporte tecnico incluido em todos os projetos. Sempre disponiveis.' : 'Technical support included in all projects. Always available.' },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-[#f8f9fc] p-6 transition-all hover:border-slate-300 hover:bg-white hover:shadow-lg">
                  <div className="mb-4 text-3xl">{item.emoji}</div>
                  <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ────────────────────────────────────────────── */}
      <section className="bg-[#f8f9fc] py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Planos mensais' : 'Monthly plans'}
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                {isPt ? 'Solucoes para cada etapa' : 'Solutions for every stage'}
              </h2>
            </div>
          </SectionReveal>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Starter', price: '499',
                desc: isPt ? 'Para pequenas empresas e startups' : 'For small businesses and startups',
                features: isPt ? ['Website profissional','Hosting incluido','Manutencao mensal','Suporte por email'] : ['Professional website','Hosting included','Monthly maintenance','Email support'],
                popular: false,
              },
              {
                name: 'Business', price: '999',
                desc: isPt ? 'Para empresas em crescimento' : 'For growing businesses',
                features: isPt ? ['Loja online completa','Marketing digital','Analytics avancado','Suporte prioritario'] : ['Complete online store','Digital marketing','Advanced analytics','Priority support'],
                popular: true,
              },
              {
                name: 'Enterprise', price: '2.499',
                desc: isPt ? 'Para grandes empresas' : 'For large companies',
                features: isPt ? ['Solucoes personalizadas','Equipa dedicada','Consultoria incluida','Suporte 24/7'] : ['Custom solutions','Dedicated team','Consulting included','24/7 support'],
                popular: false,
              },
            ].map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div className={`relative flex flex-col rounded-2xl border p-8 transition-all hover:shadow-xl
                  ${plan.popular ? 'border-[#1B7A8A] bg-[#060d1f] text-white shadow-2xl shadow-[#1B7A8A]/20 scale-[1.03]' : 'border-slate-200 bg-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                        {isPt ? 'Mais Popular' : 'Most Popular'}
                      </span>
                    </div>
                  )}
                  <h3 className={`mb-1 text-lg font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className={`mb-5 text-sm ${plan.popular ? 'text-white/50' : 'text-slate-500'}`}>{plan.desc}</p>
                  <div className="mb-6">
                    <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price} EUR</span>
                    <span className={`text-sm ${plan.popular ? 'text-white/40' : 'text-slate-400'}`}>/{isPt ? 'mes' : 'month'}</span>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.popular ? 'text-[#1B7A8A]' : 'text-emerald-500'}`} />
                        <span className={plan.popular ? 'text-white/80' : 'text-slate-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/contacto?plan=${plan.name.toLowerCase()}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all
                      ${plan.popular
                        ? 'bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white shadow-lg hover:opacity-90'
                        : 'border-2 border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                    {isPt ? 'Comecar' : 'Get Started'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#060d1f] px-8 py-20 text-center md:px-20">
              <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[#1B7A8A]/25 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-[#F5A623]/20 blur-[80px]" />
              <div className="relative">
                <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-white/25">
                  {isPt ? 'Pronto para comecar?' : 'Ready to start?'}
                </span>
                <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
                  {isPt ? 'Vamos construir algo incrivel' : "Let's build something amazing"}
                </h2>
                <p className="mx-auto mb-10 max-w-lg text-lg text-white/40">
                  {isPt
                    ? 'Consulta gratuita de 30 minutos. Sem compromisso. Resposta garantida em 24 horas.'
                    : 'Free 30-minute consultation. No commitment. Guaranteed response within 24 hours.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href={`/${locale}/contacto`}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#1B7A8A]/30 transition-all hover:scale-105">
                    {isPt ? 'Falar Connosco' : 'Talk to Us'}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link href={`/${locale}/orcamento`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                    {isPt ? 'Calcular Orcamento' : 'Calculate Budget'}
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-8 text-xs text-white/20">
                  <span>✓ {isPt ? 'Consulta gratuita' : 'Free consultation'}</span>
                  <span>✓ {isPt ? 'Resposta em 24h' : 'Response in 24h'}</span>
                  <span>✓ {isPt ? 'Sem compromisso' : 'No commitment'}</span>
                  <span>✓ ISO 9001</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}