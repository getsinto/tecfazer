import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'
import db from '@/lib/db'
import * as Icons from 'lucide-react'

export default async function ServicesOverview() {
  const t = await getTranslations('services')
  
  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 6,
  }).catch(() => [])

  return (
    <SectionReveal>
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-teal/10 text-brand-teal font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('sectionSubtitle')}
            </p>
          </div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.Code
              
              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-brand-teal"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-brand-teal transition-colors">
                      {service.titlePt}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {service.shortDescPt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 4 && (
                        <span className="px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">
                          +{service.technologies.length - 4}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/pt/servicos/${service.slug}`}
                      className="inline-flex items-center text-brand-teal font-semibold hover:gap-2 transition-all"
                    >
                      {t('learnMore')}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* View all button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white"
            >
              <Link href="/pt/servicos">
                {t('viewAll')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
