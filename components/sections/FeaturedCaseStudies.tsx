import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionReveal from '@/components/ui/SectionReveal'
import db from '@/lib/db'

export default async function FeaturedCaseStudies() {
  const t = await getTranslations('caseStudy')

  const caseStudies = await db.project.findMany({
    where: {
      isCaseStudy: true,
      isFeatured: true,
    },
    take: 2,
  }).catch(() => [])

  if (caseStudies.length === 0) return null

  return (
    <SectionReveal>
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="space-y-16">
            {caseStudies.map((project, index) => {
              const metrics = project.metrics as any
              const isEven = index % 2 === 0

              return (
                <div
                  key={project.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}
                >
                  {/* Image */}
                  <div className={`relative h-96 rounded-2xl overflow-hidden ${isEven ? '' : 'lg:col-start-2'}`}>
                    <Image
                      src={project.images[0] || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="inline-block px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-semibold mb-4">
                      Case Study
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                      {project.title}
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                      {project.descriptionPt}
                    </p>

                    {/* Challenge preview */}
                    {project.challengePt && (
                      <div className="mb-6">
                        <h4 className="font-bold text-lg mb-2">{t('challengeLabel')}</h4>
                        <p className="text-slate-600 line-clamp-3">
                          {project.challengePt}
                        </p>
                      </div>
                    )}

                    {/* Key metric */}
                    {metrics && metrics.length > 0 && (
                      <div className="flex gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-brand-teal mb-1">
                            {metrics[0].value}
                          </div>
                          <div className="text-sm text-slate-600">{metrics[0].label}</div>
                        </div>
                      </div>
                    )}

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white"
                    >
                      <Link href={`/pt/portfolio/${project.slug}`}>
                        {t('viewLiveBtn')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
