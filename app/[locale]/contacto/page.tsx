import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
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

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <SectionReveal>
                <div>
                  <h2 className="mb-6 text-2xl font-bold">
                    {locale === 'pt' ? 'Envie-nos uma Mensagem' : 'Send Us a Message'}
                  </h2>
                  <ContactForm />
                </div>
              </SectionReveal>

              {/* Contact Info */}
              <SectionReveal delay={0.2}>
                <div className="space-y-6">
                  <h2 className="mb-6 text-2xl font-bold">
                    {locale === 'pt' ? 'Informações de Contacto' : 'Contact Information'}
                  </h2>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{t('addressLabel')}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Mafra, Lisboa, Portugal
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                          <Phone className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{t('phoneContactLabel')}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a
                        href="tel:+351963101123"
                        className="text-muted-foreground hover:text-brand-teal"
                      >
                        +351 963 101 123
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                          <Mail className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{t('emailContactLabel')}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a
                        href="mailto:geral@tecfazer.pt"
                        className="text-muted-foreground hover:text-brand-teal"
                      >
                        geral@tecfazer.pt
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                          <Clock className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{t('hoursLabel')}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{t('hoursValue')}</p>
                    </CardContent>
                  </Card>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
