'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle2, Clock, Globe, HeadphonesIcon, Shield, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'

export default function WhyChooseUs() {
  const t = useTranslations('whyUs')

  const benefits = [
    {
      icon: CheckCircle2,
      title: t('benefit1Title'),
      description: t('benefit1Desc'),
    },
    {
      icon: Clock,
      title: t('benefit2Title'),
      description: t('benefit2Desc'),
    },
    {
      icon: Globe,
      title: t('benefit3Title'),
      description: t('benefit3Desc'),
    },
    {
      icon: HeadphonesIcon,
      title: t('benefit4Title'),
      description: t('benefit4Desc'),
    },
    {
      icon: Shield,
      title: t('benefit5Title'),
      description: t('benefit5Desc'),
    },
    {
      icon: Zap,
      title: t('benefit6Title'),
      description: t('benefit6Desc'),
    },
  ]

  return (
    <SectionReveal>
      <section className="py-20 bg-white">
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

          {/* Benefits grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-brand-teal hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-orange/20 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-brand-teal" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
