import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

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
  
  // Fetch all projects
  const projects = await db.project.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { completedAt: 'desc' },
    ],
  }).catch(() => [])

  // Get unique categories
  const allCategories = projects.flatMap((p) => p.categories)
  const uniqueCategories = Array.from(new Set(allCategories))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">
              {params.locale === 'pt' ? 'Nosso Portfolio' : 'Our Portfolio'}
            </h1>
            <p className="text-xl text-gray-600">
              {params.locale === 'pt' 
                ? 'Projetos que transformam ideias em realidade digital'
                : 'Projects that transform ideas into digital reality'}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-orange text-white font-medium transition-all hover:shadow-lg">
              {params.locale === 'pt' ? 'Todos' : 'All'}
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-medium transition-all hover:border-brand-teal hover:text-brand-teal"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/${params.locale}/portfolio/${project.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {project.isFeatured && (
                      <div className="absolute top-4 right-4 bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                        {params.locale === 'pt' ? 'Destaque' : 'Featured'}
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-teal transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {params.locale === 'pt' ? project.descriptionPt : project.descriptionEn}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs text-brand-teal font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {params.locale === 'pt' 
                  ? 'Nenhum projeto encontrado.' 
                  : 'No projects found.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {params.locale === 'pt' 
              ? 'Pronto para o seu próximo projeto?' 
              : 'Ready for your next project?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {params.locale === 'pt'
              ? 'Vamos transformar a sua ideia em realidade digital'
              : "Let's transform your idea into digital reality"}
          </p>
          <Link
            href={`/${params.locale}/contacto`}
            className="inline-block px-8 py-4 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {params.locale === 'pt' ? 'Fale Connosco' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  )
}
