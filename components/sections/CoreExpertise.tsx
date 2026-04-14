'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionReveal from '@/components/ui/SectionReveal'

export default function CoreExpertise() {
  const t = useTranslations('expertise')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const technologies = [
    { name: 'React & Next.js', level: 96 },
    { name: 'TypeScript', level: 94 },
    { name: 'Node.js & Express', level: 93 },
    { name: 'MongoDB & PostgreSQL', level: 92 },
    { name: 'Stripe & Payments', level: 91 },
    { name: 'React Native & Flutter', level: 90 },
    { name: 'UI/UX Design', level: 89 },
    { name: 'Python & Django', level: 88 },
    { name: 'Firebase', level: 88 },
    { name: 'AWS & Cloud', level: 87 },
    { name: 'DevOps & CI/CD', level: 86 },
    { name: 'Docker & Kubernetes', level: 85 },
    { name: 'GraphQL', level: 84 },
    { name: 'PHP & Laravel', level: 82 },
  ]

  return (
    <SectionReveal>
      <section ref={ref} className="py-20 bg-white">
        <div className="container px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('sectionSubtitle')}
            </p>
          </div>

          {/* Technologies grid */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{tech.name}</span>
                  <span className="text-sm font-bold text-brand-teal">{tech.level}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${tech.level}%` } : {}}
                    transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand-teal to-brand-orange rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
