import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getDbClient } from '@/lib/db'
import { buildMetadata } from '@/lib/seo'
import SectionReveal from '@/components/ui/SectionReveal'
import { ArrowRight, Sparkles, ExternalLink, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Portfolio - Projetos de Sucesso | Tec Fazer',
    titleEn: 'Portfolio - Success Projects | Tec Fazer',
    descPt: 'Explore os nossos projetos de desenvolvimento web, aplicações móveis e soluções digitais. Casos de estudo detalhados com resultados comprovados.',
    descEn: 'Explore our web development projects, mobile applications and digital solutions. Detailed case studies with proven results.',
    path: '/portfolio',
  })
}

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('portfolio')
  
  let projects: any[] = []
  let uniqueCategories: string[] = []
  
  try {
    const db = getDbClient()
    projects = await db.project.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { completedAt: 'desc' },
      ],
    })
    
    const allCategories = projects.flatMap((p) => p.categories)
    uniqueCategories = Array.from(new Set(allCategories))
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
                <Award className="h-4 w-4" />
                {params.locale === 'pt' ? 'Projetos de Excelência' : 'Excellence Projects'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {params.locale === 'pt' ? 'Nosso Portfolio' : 'Our Portfolio'}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl">
                {params.locale === 'pt' 
                  ? 'Projetos que transformam ideias em realidade digital'
                  : 'Projects that transform ideas into digital reality'}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Filter Section */}
      {uniqueCategories.length > 0 && (
        <section className="border-b bg-white py-8 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-orange text-white font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105">
                {params.locale === 'pt' ? 'Todos' : 'All'}
              </button>
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-2.5 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-medium transition-all hover:border-brand-teal hover:text-brand-teal hover:shadow-md"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <SectionReveal key={project.id} delay={index * 0.1}>
                  <Link
                    href={`/${params.locale}/portfolio/${project.slug}`}
                    className="group block h-full"
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      {/* Project Image */}
                      <div className="relative h-64 overflow-hidden">
                        {project.images[0] ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-teal to-brand-orange">
                            <span className="text-6xl font-bold text-white">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {project.isFeatured && (
                          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-brand-orange px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            {params.locale === 'pt' ? 'Destaque' : 'Featured'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 transition-all group-hover:opacity-100">
                          <ExternalLink className="h-5 w-5 text-brand-teal" />
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-brand-teal">
                          {project.title}
                        </h3>
                        <p className="mb-4 flex-1 text-slate-600 line-clamp-3">
                          {params.locale === 'pt' ? project.descriptionPt : project.descriptionEn}
                        </p>

                        {/* Categories */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {project.categories.slice(0, 3).map((category: string) => (
                            <span
                              key={category}
                              className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal"
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 border-t pt-4">
                          {project.technologies.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="text-xs font-medium text-slate-500"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-xs font-medium text-slate-400">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-16 text-center">
              <Award className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg text-muted-foreground">
                {params.locale === 'pt' 
                  ? 'Os nossos projetos estarão disponíveis em breve' 
                  : 'Our projects will be available soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {params.locale === 'pt' 
                  ? 'Pronto para o Seu Próximo Projeto?' 
                  : 'Ready for Your Next Project?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {params.locale === 'pt'
                  ? 'Vamos transformar a sua ideia em realidade digital'
                  : "Let's transform your idea into digital reality"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-brand-teal hover:bg-white/90">
                  <Link href={`/${params.locale}/contacto`}>
                    {params.locale === 'pt' ? 'Fale Connosco' : 'Contact Us'}
                    <ArrowRight className="ml-2 h-5 w-5" />
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
