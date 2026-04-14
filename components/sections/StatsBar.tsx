'use client'

import { useTranslations } from 'next-intl'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import SectionReveal from '@/components/ui/SectionReveal'

export default function StatsBar() {
  const t = useTranslations('stats')

  const stats = [
    { value: 300, suffix: '+', label: t('projectsLabel') },
    { value: 106, suffix: '+', label: t('clientsLabel') },
    { value: 5, suffix: '+', label: t('yearsLabel') },
    { value: 30, suffix: '+', label: t('technologiesLabel') },
  ]

  return (
    <SectionReveal>
      <section className="py-16 bg-gradient-to-r from-brand-teal to-brand-orange">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
