'use client'

import { useTranslations } from 'next-intl'
import SectionReveal from '@/components/ui/SectionReveal'

export default function PartnersBar() {
  const t = useTranslations('partners')

  const partners = [
    'AWS',
    'Google Cloud',
    'Microsoft Azure',
    'Vercel',
    'Docker',
    'MongoDB',
    'Stripe',
    'PostgreSQL',
    'Kubernetes',
    'React',
    'GitHub',
    'Cloudflare',
  ]

  return (
    <SectionReveal>
      <section className="py-16 bg-white overflow-hidden">
        <div className="container px-4 mb-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('sectionTitle')}
            </h2>
          </div>
        </div>

        {/* Infinite scroll marquee */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 text-2xl font-bold text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>
    </SectionReveal>
  )
}
