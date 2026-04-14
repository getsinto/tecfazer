'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'

interface PricingPlan {
  id: string
  slug: string
  namePt: string
  monthlyPrice: any
  annualPrice: any
  features: any
  isPopular: boolean
  ctaTextPt: string
}

interface PricingSectionProps {
  plans: PricingPlan[]
}

export default function PricingSection({ plans }: PricingSectionProps) {
  const t = useTranslations('pricing')
  const [isAnnual, setIsAnnual] = useState(false)

  const savings = 17 // percentage saved with annual

  return (
    <SectionReveal>
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              {t('sectionSubtitle')}
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-white rounded-full shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  !isAnnual
                    ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isAnnual
                    ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('annual')}
                <span className="ml-2 text-xs bg-brand-orange/20 px-2 py-1 rounded-full">
                  {t('saveLabel', { percent: savings })}
                </span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
              const priceNum = typeof price === 'number' ? price : parseFloat(String(price))

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.isPopular
                      ? 'border-2 border-brand-teal shadow-xl scale-105'
                      : 'border hover:border-brand-teal/50'
                  } transition-all duration-300`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-brand-teal to-brand-orange text-white text-sm font-semibold rounded-full shadow-lg">
                        {t('popular')}
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <h3 className="text-2xl font-bold mb-4">{plan.namePt}</h3>
                    <div className="mb-2">
                      {priceNum === 0 ? (
                        <div className="text-4xl font-bold">Custom</div>
                      ) : (
                        <>
                          <span className="text-5xl font-bold">€{priceNum}</span>
                          <span className="text-slate-600">
                            {isAnnual ? t('perYear') : t('perMonth')}
                          </span>
                        </>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feature.included ? 'text-slate-700' : 'text-slate-400'
                            }
                          >
                            {feature.textPt}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className={`w-full ${
                        plan.isPopular
                          ? 'bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90'
                          : 'bg-slate-900 hover:bg-slate-800'
                      } text-white`}
                    >
                      <Link href={priceNum === 0 ? '/pt/contacto' : '/pt/portal/login'}>
                        {plan.ctaTextPt}
                      </Link>
                    </Button>
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
