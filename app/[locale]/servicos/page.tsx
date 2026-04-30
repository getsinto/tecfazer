'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { servicesData } from '@/lib/services-data'
import { useLocale } from 'next-intl'

export default function ServicesPage() {
  const locale = useLocale()
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en
  const categories = Object.entries(services)
  const [activeCategory, setActiveCategory] = useState(categories[0][0])

  const activeData = services[activeCategory]

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0f1e] pt-32 pb-24">
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#1B7A8A]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F5A623]/15 blur-[120px]" />

        <div className="container relative mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/60 backdrop-blur-sm">
              {locale === 'pt' ? 'O que fazemos' : 'What we do'}
            </span>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              {locale === 'pt' ? (
                <>Serviços que<br /><span className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] bg-clip-text text-transparent">transformam negócios</span></>
              ) : (
                <>Services that<br /><span className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] bg-clip-text text-transparent">transform businesses</span></>
              )}
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/50">
              {locale === 'pt'
                ? 'Mais de 50 serviços especializados. Desde um simples logo até sistemas empresariais completos.'
                : 'Over 50 specialized services. From a simple logo to complete enterprise systems.'}
            </p>
          </motion.div>

          {/* stat strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {[
              { n: '300+', l: locale === 'pt' ? 'Projetos' : 'Projects' },
              { n: '106+', l: locale === 'pt' ? 'Clientes' : 'Clients' },
              { n: '5+', l: locale === 'pt' ? 'Anos' : 'Years' },
            ].map(s => (
              <div key={s.l} className="py-6 text-center">
                <div className="text-3xl font-bold text-white">{s.n}</div>
                <div className="mt-1 text-xs text-white/40 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY NAV + GRID ──────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">

          {/* sticky category tabs */}
          <div className="sticky top-16 z-30 -mx-6 mb-16 overflow-x-auto bg-white/90 px-6 py-4 backdrop-blur-md border-b border-slate-100">
            <div className="flex gap-2 min-w-max">
              {categories.map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${activeCategory === key
                      ? 'bg-[#0a0f1e] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* category header */}
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="mb-12 flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${activeData.color} shadow-lg`}>
                <activeData.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeData.title}</h2>
                <p className="text-slate-500 text-sm mt-0.5">{activeData.description}</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {activeData.services.length} {locale === 'pt' ? 'serviços' : 'services'}
            </span>
          </motion.div>

          {/* service cards grid */}
          <motion.div key={`grid-${activeCategory}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeData.services.map((service, i) => (
              <motion.div key={service.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Link href={`/${locale}/servicos/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1">

                  {/* top accent line */}
                  <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${activeData.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* price tag */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${activeData.color} shadow-sm`}>
                      <activeData.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      {service.price}
                    </span>
                  </div>

                  {/* title + desc */}
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-[#1B7A8A] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-500 flex-1">
                    {service.description}
                  </p>

                  {/* features */}
                  <div className="mb-5 space-y-1.5">
                    {service.features.slice(0, 3).map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* tech pills */}
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {service.technologies.slice(0, 3).map(t => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{t}</span>
                    ))}
                    {service.technologies.length > 3 && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">+{service.technologies.length - 3}</span>
                    )}
                  </div>

                  {/* cta row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium text-[#1B7A8A]">
                      {locale === 'pt' ? 'Ver detalhes' : 'View details'}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all duration-200 group-hover:bg-[#1B7A8A] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0f1e] px-8 py-16 text-center md:px-16">
            <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#1B7A8A]/30 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#F5A623]/20 blur-[80px]" />
            <div className="relative">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
                {locale === 'pt' ? 'Pronto para começar?' : 'Ready to start?'}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {locale === 'pt' ? 'Vamos trabalhar juntos' : "Let's work together"}
              </h2>
              <p className="mx-auto mb-8 max-w-md text-white/50">
                {locale === 'pt'
                  ? 'Consulta gratuita de 30 minutos. Sem compromisso. Resposta em 24h.'
                  : 'Free 30-minute consultation. No commitment. Response within 24h.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/${locale}/contacto`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90">
                  {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/${locale}/orcamento`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                  {locale === 'pt' ? 'Calcular Orçamento' : 'Get a Quote'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
