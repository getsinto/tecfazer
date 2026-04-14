'use client'

import { useTranslations } from 'next-intl'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ContactForm from '@/components/forms/ContactForm'
import SectionReveal from '@/components/ui/SectionReveal'

export default function ContactSection() {
  const t = useTranslations('contact')

  const contactInfo = [
    {
      icon: MapPin,
      label: t('addressLabel'),
      value: 'Mafra, Lisboa, Portugal',
    },
    {
      icon: Phone,
      label: t('phoneContactLabel'),
      value: '963 101 123',
      href: 'tel:+351963101123',
    },
    {
      icon: Mail,
      label: t('emailContactLabel'),
      value: 'geral@tecfazer.pt',
      href: 'mailto:geral@tecfazer.pt',
    },
    {
      icon: Clock,
      label: t('hoursLabel'),
      value: t('hoursValue'),
    },
  ]

  return (
    <SectionReveal>
      <section className="py-20 bg-slate-50">
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

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const content = (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-orange/20 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-brand-teal" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">
                          {info.label}
                        </div>
                        <div className="text-slate-600">{info.value}</div>
                      </div>
                    </CardContent>
                  </Card>
                )

                return info.href ? (
                  <a key={index} href={info.href} className="block">
                    {content}
                  </a>
                ) : (
                  content
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
