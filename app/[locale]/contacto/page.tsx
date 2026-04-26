import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, Phone, Clock, Send, MessageSquare, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContactForm from '@/components/forms/ContactForm'
import SectionReveal from '@/components/ui/SectionReveal'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return buildMetadata({
    locale,
    titlePt: 'Contacto',
    titleEn: 'Contact',
    descPt: 'Entre em contacto com a Tec Fazer. Estamos prontos para transformar a sua ideia em realidade.',
    descEn: 'Get in touch with Tec Fazer. We are ready to turn your idea into reality.',
    path: `/${locale}/contacto`,
  })
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('contact')

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Tec Fazer',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
    '@id': process.env.NEXT_PUBLIC_SITE_URL,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: '+351963101123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mafra',
      addressLocality: 'Lisboa',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.9369,
      longitude: -9.3258,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://linkedin.com/company/tecfazer',
      'https://github.com/tecfazer',
      'https://instagram.com/tecfazer',
      'https://facebook.com/tecfazer',
    ],
  }

  return (
    <>
      <JsonLd schema={localBusinessSchema} />
      
      <div className="flex flex-col">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <div className="container relative z-10 mx-auto px-4">
            <SectionReveal>
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <MessageSquare className="h-4 w-4" />
                  {locale === 'pt' ? 'Vamos Conversar' : "Let's Talk"}
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

        {/* Contact Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Contact Form - Takes 3 columns */}
              <div className="lg:col-span-3">
                <SectionReveal>
                  <Card className="border-0 shadow-2xl">
                    <CardHeader className="space-y-1 pb-8">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange shadow-lg">
                        <Send className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold">
                        {locale === 'pt' ? 'Envie-nos uma Mensagem' : 'Send Us a Message'}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {locale === 'pt' 
                          ? 'Preencha o formulário e entraremos em contacto em breve'
                          : 'Fill out the form and we will get back to you soon'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ContactForm />
                    </CardContent>
                  </Card>
                </SectionReveal>
              </div>

              {/* Contact Info - Takes 2 columns */}
              <div className="space-y-6 lg:col-span-2">
                <SectionReveal delay={0.2}>
                  <div className="mb-8">
                    <h2 className="mb-2 text-2xl font-bold">
                      {locale === 'pt' ? 'Informações de Contacto' : 'Contact Information'}
                    </h2>
                    <p className="text-muted-foreground">
                      {locale === 'pt' 
                        ? 'Estamos aqui para ajudar'
                        : 'We are here to help'}
                    </p>
                  </div>
                </SectionReveal>

                <SectionReveal delay={0.3}>
                  <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-brand-teal to-cyan-500" />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-cyan-500 shadow-lg">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{t('addressLabel')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'pt' ? 'Visite-nos' : 'Visit us'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-slate-700">
                        Mafra, Lisboa, Portugal
                      </p>
                    </CardContent>
                  </Card>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                  <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-brand-orange to-red-500" />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-red-500 shadow-lg">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{t('phoneContactLabel')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'pt' ? 'Ligue-nos' : 'Call us'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a
                        href="tel:+351963101123"
                        className="font-medium text-slate-700 transition-colors hover:text-brand-teal"
                      >
                        +351 963 101 123
                      </a>
                    </CardContent>
                  </Card>
                </SectionReveal>

                <SectionReveal delay={0.5}>
                  <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{t('emailContactLabel')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'pt' ? 'Envie email' : 'Send email'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a
                        href="mailto:geral@tecfazer.pt"
                        className="font-medium text-slate-700 transition-colors hover:text-brand-teal"
                      >
                        geral@tecfazer.pt
                      </a>
                    </CardContent>
                  </Card>
                </SectionReveal>

                <SectionReveal delay={0.6}>
                  <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{t('hoursLabel')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'pt' ? 'Horário' : 'Schedule'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-slate-700">{t('hoursValue')}</p>
                    </CardContent>
                  </Card>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Why Contact Us Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                  {locale === 'pt' ? 'Porquê Contactar-nos?' : 'Why Contact Us?'}
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  {locale === 'pt' 
                    ? 'Estamos prontos para transformar a sua visão em realidade'
                    : 'We are ready to transform your vision into reality'}
                </p>
              </div>
            </SectionReveal>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { 
                  icon: '⚡', 
                  title: locale === 'pt' ? 'Resposta Rápida' : 'Fast Response',
                  desc: locale === 'pt' ? 'Respondemos em menos de 24 horas' : 'We respond in less than 24 hours'
                },
                { 
                  icon: '🎯', 
                  title: locale === 'pt' ? 'Consultoria Gratuita' : 'Free Consultation',
                  desc: locale === 'pt' ? 'Primeira consulta sem compromisso' : 'First consultation without commitment'
                },
                { 
                  icon: '💡', 
                  title: locale === 'pt' ? 'Soluções Personalizadas' : 'Custom Solutions',
                  desc: locale === 'pt' ? 'Adaptadas às suas necessidades' : 'Adapted to your needs'
                },
              ].map((item, index) => (
                <SectionReveal key={index} delay={index * 0.1}>
                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 text-center shadow-lg transition-all hover:shadow-xl">
                    <div className="mb-4 text-5xl">{item.icon}</div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
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
                <Sparkles className="mx-auto mb-6 h-16 w-16 text-brand-orange" />
                <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                  {locale === 'pt'
                    ? 'Vamos Começar o Seu Projeto?'
                    : "Let's Start Your Project?"}
                </h2>
                <p className="text-xl text-white/80">
                  {locale === 'pt'
                    ? 'Estamos ansiosos para ouvir sobre a sua ideia'
                    : 'We look forward to hearing about your idea'}
                </p>
              </div>
            </SectionReveal>
          </div>
        </section>
      </div>
    </>
  )
}
