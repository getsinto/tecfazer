import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getDbClient } from '@/lib/db'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SectionReveal from '@/components/ui/SectionReveal'
import { Check, X, Sparkles, Zap, Crown, Rocket, HelpCircle } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { formatCurrency } from '@/lib/utils'

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

const planIcons: Record<number, any> = {
  0: Zap,
  1: Rocket,
  2: Crown,
  3: Sparkles,
}

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('pricing')

  let plans: any[] = []
  try {
    const db = getDbClient()
    plans = await db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
  }

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {locale === 'pt' ? 'Preços Transparentes' : 'Transparent Pricing'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {t('sectionTitle')}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl">
                {t('sectionSubtitle')}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          {plans.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan, index) => {
                const features = plan.features as Array<{
                  textPt: string
                  textEn: string
                  included: boolean
                }>
                
                const Icon = planIcons[index] || Zap

                return (
                  <SectionReveal key={plan.id} delay={index * 0.1}>
                    <Card
                      className={`group relative flex h-full flex-col overflow-hidden border-0 shadow-lg transition-all hover:scale-105 hover:shadow-2xl ${
                        plan.isPopular ? 'ring-2 ring-brand-orange' : ''
                      }`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -right-12 top-8 rotate-45 bg-gradient-to-r from-brand-orange to-red-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
                          {t('popular')}
                        </div>
                      )}
                      
                      <div className={`h-2 ${plan.isPopular ? 'bg-gradient-to-r from-brand-orange to-red-500' : 'bg-gradient-to-r from-brand-teal to-cyan-500'}`} />
                      
                      <CardHeader className="pb-4">
                        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${plan.isPopular ? 'bg-gradient-to-br from-brand-orange to-red-500' : 'bg-gradient-to-br from-brand-teal to-cyan-500'} shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
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
                              <div className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                                {formatCurrency(Number(plan.annualPrice), plan.currency)} {t('perYear')}
                                <span className="ml-1 text-xs text-green-600">
                                  ({locale === 'pt' ? 'Poupe' : 'Save'} {Math.round((1 - Number(plan.annualPrice) / (Number(plan.monthlyPrice) * 12)) * 100)}%)
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4 text-3xl font-bold text-foreground">
                              {locale === 'pt' ? 'Personalizado' : 'Custom'}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        <ul className="space-y-3">
                          {features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              {feature.included ? (
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                              ) : (
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                  <X className="h-3 w-3 text-slate-400" />
                                </div>
                              )}
                              <span
                                className={
                                  feature.included
                                    ? 'text-sm font-medium'
                                    : 'text-sm text-muted-foreground line-through'
                                }
                              >
                                {locale === 'pt' ? feature.textPt : feature.textEn}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      
                      <CardFooter className="pt-6">
                        <Button
                          asChild
                          className={`w-full ${plan.isPopular ? 'bg-gradient-to-r from-brand-orange to-red-500 hover:from-brand-orange/90 hover:to-red-500/90' : 'bg-gradient-to-r from-brand-teal to-cyan-500 hover:from-brand-teal/90 hover:to-cyan-500/90'}`}
                          size="lg"
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
          ) : (
            <div className="rounded-2xl bg-slate-50 p-16 text-center">
              <Crown className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Os nossos planos estarão disponíveis em breve'
                  : 'Our plans will be available soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </div>
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('faqTitle')}</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Respostas às perguntas mais frequentes sobre os nossos planos'
                  : 'Answers to the most frequently asked questions about our plans'}
              </p>
            </div>
          </SectionReveal>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((num, index) => (
              <SectionReveal key={num} delay={index * 0.1}>
                <Card className="border-0 shadow-lg transition-all hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3 text-lg">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-sm font-bold text-brand-teal">
                        {num}
                      </div>
                      <span>{t(`faq${num}Question` as any)}</span>
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

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {locale === 'pt'
                  ? 'Ainda Tem Dúvidas?'
                  : 'Still Have Questions?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {locale === 'pt'
                  ? 'A nossa equipa está pronta para ajudar a escolher o plano ideal'
                  : 'Our team is ready to help you choose the ideal plan'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-brand-teal hover:bg-white/90">
                  <Link href={`/${locale}/contacto`}>
                    {locale === 'pt' ? 'Falar com Especialista' : 'Talk to Specialist'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href={`/${locale}/orcamento`}>
                    {locale === 'pt' ? 'Calcular Orçamento' : 'Calculate Budget'}
                  </Link>
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
