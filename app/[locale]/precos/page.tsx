import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SectionReveal from '@/components/ui/SectionReveal'
import { Check, X } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { formatCurrency } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return buildMetadata({
    locale,
    titlePt: 'Preços',
    titleEn: 'Pricing',
    descPt: 'Planos transparentes e flexíveis para o seu negócio. Escolha o plano ideal para as suas necessidades.',
    descEn: 'Transparent and flexible plans for your business. Choose the ideal plan for your needs.',
    path: `/${locale}/precos`,
  })
}

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('pricing')

  // Fetch pricing plans (with graceful fallback)
  let plans: any[] = []
  try {
    plans = await db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
    // Return empty state - will show "no plans" message
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-brand-teal/5 py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-block rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur">
                {t('sectionBadge')}
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('sectionTitle')}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                {t('sectionSubtitle')}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => {
              const features = plan.features as Array<{
                textPt: string
                textEn: string
                included: boolean
              }>

              return (
                <SectionReveal key={plan.id} delay={index * 0.1}>
                  <Card
                    className={`relative flex h-full flex-col ${
                      plan.isPopular ? 'border-brand-teal shadow-lg' : ''
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-medium text-white">
                          {t('popular')}
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {locale === 'pt' ? plan.namePt : plan.nameEn}
                      </CardTitle>
                      <CardDescription>
                        {Number(plan.monthlyPrice) > 0 ? (
                          <div className="mt-4">
                            <div className="flex items-baseline">
                              <span className="text-4xl font-bold text-foreground">
                                {formatCurrency(Number(plan.monthlyPrice), plan.currency)}
                              </span>
                              <span className="ml-2 text-muted-foreground">
                                {t('perMonth')}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {formatCurrency(Number(plan.annualPrice), plan.currency)} {t('perYear')}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 text-2xl font-bold text-foreground">
                            {locale === 'pt' ? 'Personalizado' : 'Custom'}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            {feature.included ? (
                              <Check className="h-5 w-5 shrink-0 text-brand-teal" />
                            ) : (
                              <X className="h-5 w-5 shrink-0 text-muted-foreground" />
                            )}
                            <span
                              className={
                                feature.included
                                  ? 'text-sm'
                                  : 'text-sm text-muted-foreground line-through'
                              }
                            >
                              {locale === 'pt' ? feature.textPt : feature.textEn}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        variant={plan.isPopular ? 'default' : 'outline'}
                        className="w-full"
                      >
                        <Link href={`/${locale}/contacto`}>
                          {locale === 'pt' ? plan.ctaTextPt : plan.ctaTextEn}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('faqTitle')}</h2>
            </div>
          </SectionReveal>

          <div className="mx-auto max-w-3xl space-y-6">
            {[1, 2, 3, 4, 5, 6].map((num, index) => (
              <SectionReveal key={num} delay={index * 0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t(`faq${num}Question` as any)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t(`faq${num}Answer` as any)}
                    </p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
