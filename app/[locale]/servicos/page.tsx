import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, Star, Users, Award, Zap } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData } from '@/lib/services-data'
import SectionReveal from '@/components/ui/SectionReveal'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return buildMetadata({
    locale,
    titlePt: 'Servicos de Tecnologia | Desenvolvimento Web, Mobile, Cloud, Design & Marketing | Tec Fazer',
    titleEn: 'Technology Services | Web, Mobile, Cloud, Design & Marketing Development | Tec Fazer',
    descPt: 'Mais de 50 servicos especializados: desenvolvimento web, WordPress, apps mobile, e-commerce, cloud, design grafico, marketing digital, IA e ciberseguranca. Precos a partir de 50 EUR. ISO 9001.',
    descEn: 'Over 50 specialized services: web development, WordPress, mobile apps, e-commerce, cloud, graphic design, digital marketing, AI and cybersecurity. Prices from 50 EUR. ISO 9001.',
    path: `/${locale}/servicos`,
  })
}

const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  development: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  mobile:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  ecommerce:   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cloud:       { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  design:      { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
  marketing:   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  ai:          { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  security:    { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  consulting:  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  support:     { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en
  const categories = Object.entries(services)
  const isPt = locale === 'pt'

  const totalServices = categories.reduce((acc, [, cat]) => acc + cat.services.length, 0)

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060d1f] pt-28 pb-20">
        {/* dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* glow */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1B7A8A]/25 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#F5A623]/20 blur-[100px]" />

        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1B7A8A] animate-pulse" />
              {isPt ? 'Tec Fazer — Servicos' : 'Tec Fazer — Services'}
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {isPt ? (
                <>Tudo o que o seu<br />
                  <span className="bg-gradient-to-r from-[#1B7A8A] via-[#22a8bc] to-[#F5A623] bg-clip-text text-transparent">
                    negocio precisa
                  </span>
                </>
              ) : (
                <>Everything your<br />
                  <span className="bg-gradient-to-r from-[#1B7A8A] via-[#22a8bc] to-[#F5A623] bg-clip-text text-transparent">
                    business needs
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/50">
              {isPt
                ? `${totalServices} servicos especializados numa unica empresa. Desde um simples logo ate sistemas empresariais completos — entregamos resultados reais.`
                : `${totalServices} specialized services in one company. From a simple logo to complete enterprise systems — we deliver real results.`}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/contacto`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#1B7A8A]/30 transition-all hover:scale-105 hover:shadow-2xl">
                {isPt ? 'Consulta Gratuita' : 'Free Consultation'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}/orcamento`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                {isPt ? 'Calcular Orcamento' : 'Get a Quote'}
              </Link>
            </div>
          </div>

          {/* trust bar */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { icon: Star, n: '300+', l: isPt ? 'Projetos' : 'Projects' },
              { icon: Users, n: '106+', l: isPt ? 'Clientes' : 'Clients' },
              { icon: Award, n: 'ISO 9001', l: isPt ? 'Certificado' : 'Certified' },
              { icon: Zap, n: '24h', l: isPt ? 'Resposta' : 'Response' },
            ].map(({ icon: Icon, n, l }) => (
              <div key={l} className="flex flex-col items-center gap-1 bg-[#060d1f] py-5 px-4">
                <Icon className="mb-1 h-4 w-4 text-[#1B7A8A]" />
                <span className="text-xl font-bold text-white">{n}</span>
                <span className="text-xs text-white/35 uppercase tracking-widest">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-16 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(([key, cat]) => (
              <a key={key} href={`#${key}`}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <cat.icon className="h-3.5 w-3.5" />
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── ALL CATEGORIES ────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6">
        {categories.map(([key, category], catIdx) => {
          const colors = categoryColors[key] || categoryColors.development
          return (
            <section key={key} id={key} className="py-20 scroll-mt-28">
              <SectionReveal>
                {/* category header */}
                <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}>
                      <category.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest ${colors.bg} ${colors.text}`}>
                          {category.services.length} {isPt ? 'servicos' : 'services'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{category.title}</h2>
                      <p className="mt-1 text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/contacto?category=${key}`}
                    className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                    {isPt ? 'Pedir Proposta' : 'Request Proposal'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </SectionReveal>

              {/* service cards */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {category.services.map((service, sIdx) => (
                  <SectionReveal key={service.slug} delay={sIdx * 0.04}>
                    <Link href={`/${locale}/servicos/${service.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1.5">

                      {/* colored top bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${category.color}`} />

                      <div className="flex flex-1 flex-col p-6">
                        {/* header row */}
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-md`}>
                            <category.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${colors.bg} ${colors.text} ${colors.border}`}>
                            {service.price}
                          </span>
                        </div>

                        {/* title */}
                        <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#1B7A8A]">
                          {service.title}
                        </h3>

                        {/* description */}
                        <p className="mb-5 text-sm leading-relaxed text-slate-500 flex-1">
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
                            <div className="text-xs text-slate-400 pl-6">
                              +{service.features.length - 3} {isPt ? 'mais' : 'more'}
                            </div>
                          )}
                        </div>

                        {/* tech pills */}
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {service.technologies.slice(0, 4).map(t => (
                            <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{t}</span>
                          ))}
                          {service.technologies.length > 4 && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400">+{service.technologies.length - 4}</span>
                          )}
                        </div>

                        {/* timeline */}
                        {service.timeline && (
                          <div className="mb-5 flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {service.timeline}
                          </div>
                        )}

                        {/* footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs font-semibold text-[#1B7A8A]">
                            {isPt ? 'Ver detalhes' : 'View details'}
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-200 group-hover:bg-[#1B7A8A] group-hover:text-white">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SectionReveal>
                ))}
              </div>

              {/* divider between categories */}
              {catIdx < categories.length - 1 && (
                <div className="mt-20 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              )}
            </section>
          )
        })}
      </div>

      {/* ─── WHY TEC FAZER ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Por que nos escolher' : 'Why choose us'}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {isPt ? 'Uma empresa, todas as solucoes' : 'One company, all solutions'}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-500">
                {isPt
                  ? 'Nao precisa de contratar multiplas agencias. Temos tudo o que precisa sob um unico teto.'
                  : 'No need to hire multiple agencies. We have everything you need under one roof.'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '🎯',
                title: isPt ? 'Resultados Reais' : 'Real Results',
                desc: isPt ? '300+ projetos entregues com sucesso para clientes em Portugal e no mundo.' : '300+ projects successfully delivered for clients in Portugal and worldwide.',
              },
              {
                icon: '⚡',
                title: isPt ? 'Entrega Rapida' : 'Fast Delivery',
                desc: isPt ? 'Metodologia agil com entregas rapidas e comunicacao transparente.' : 'Agile methodology with fast deliveries and transparent communication.',
              },
              {
                icon: '🔒',
                title: isPt ? 'Qualidade Garantida' : 'Quality Guaranteed',
                desc: isPt ? 'ISO 9001 certificado. Codigo limpo, testado e documentado.' : 'ISO 9001 certified. Clean, tested and documented code.',
              },
              {
                icon: '💬',
                title: isPt ? 'Suporte Dedicado' : 'Dedicated Support',
                desc: isPt ? 'Suporte tecnico incluido em todos os projetos. Sempre disponiveis.' : 'Technical support included in all projects. Always available.',
              },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg">
                  <div className="mb-4 text-3xl">{item.icon}</div>
                  <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING PLANS ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#1B7A8A]">
                {isPt ? 'Planos mensais' : 'Monthly plans'}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {isPt ? 'Solucoes para cada etapa' : 'Solutions for every stage'}
              </h2>
            </div>
          </SectionReveal>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '499',
                desc: isPt ? 'Para pequenas empresas e startups' : 'For small businesses and startups',
                features: isPt
                  ? ['Website profissional', 'Hosting incluido', 'Manutencao mensal', 'Suporte por email']
                  : ['Professional website', 'Hosting included', 'Monthly maintenance', 'Email support'],
                popular: false,
                cta: isPt ? 'Comecar' : 'Get Started',
              },
              {
                name: 'Business',
                price: '999',
                desc: isPt ? 'Para empresas em crescimento' : 'For growing businesses',
                features: isPt
                  ? ['Loja online completa', 'Marketing digital', 'Analytics avancado', 'Suporte prioritario']
                  : ['Complete online store', 'Digital marketing', 'Advanced analytics', 'Priority support'],
                popular: true,
                cta: isPt ? 'Mais Popular' : 'Most Popular',
              },
              {
                name: 'Enterprise',
                price: '2499',
                desc: isPt ? 'Para grandes empresas' : 'For large companies',
                features: isPt
                  ? ['Solucoes personalizadas', 'Equipa dedicada', 'Consultoria incluida', 'Suporte 24/7']
                  : ['Custom solutions', 'Dedicated team', 'Consulting included', '24/7 support'],
                popular: false,
                cta: isPt ? 'Contactar' : 'Contact Us',
              },
            ].map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div className={`relative flex flex-col rounded-2xl border p-8 transition-shadow hover:shadow-xl
                  ${plan.popular
                    ? 'border-[#1B7A8A] bg-[#060d1f] text-white shadow-2xl shadow-[#1B7A8A]/20 scale-105'
                    : 'border-slate-200 bg-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-4 py-1 text-xs font-bold text-white shadow-lg">
                        {isPt ? 'Mais Popular' : 'Most Popular'}
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`mb-1 text-lg font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                    <p className={`text-sm ${plan.popular ? 'text-white/50' : 'text-slate-500'}`}>{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price} EUR</span>
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
                        : 'border border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#060d1f] px-8 py-20 text-center md:px-20">
              <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[#1B7A8A]/25 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-[#F5A623]/20 blur-[80px]" />
              <div className="relative">
                <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-white/30">
                  {isPt ? 'Pronto para comecar?' : 'Ready to start?'}
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
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
                <div className="mt-8 flex flex-wrap justify-center gap-8 text-xs text-white/25">
                  <span>✓ {isPt ? 'Consulta gratuita' : 'Free consultation'}</span>
                  <span>✓ {isPt ? 'Resposta em 24h' : 'Response in 24h'}</span>
                  <span>✓ {isPt ? 'Sem compromisso' : 'No commitment'}</span>
                  <span>✓ {isPt ? 'ISO 9001 certificado' : 'ISO 9001 certified'}</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
