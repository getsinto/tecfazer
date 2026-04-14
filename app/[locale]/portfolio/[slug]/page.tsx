import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, Users, DollarSign } from 'lucide-react'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const project = await db.project.findUnique({
    where: { slug: params.slug },
  })

  if (!project) return {}

  return buildMetadata({
    locale: params.locale,
    titlePt: `${project.title} - Portfolio | Tec Fazer`,
    titleEn: `${project.title} - Portfolio | Tec Fazer`,
    descPt: project.descriptionPt,
    descEn: project.descriptionEn,
    path: `/portfolio/${params.slug}`,
    image: project.images[0],
  })
}

export async function generateStaticParams() {
  // Return empty array to prevent static generation at build time
  // Pages will be generated dynamically at request time
  return []
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const project = await db.project.findUnique({
    where: { slug: params.slug },
  })

  if (!project) notFound()

  const description = params.locale === 'pt' ? project.descriptionPt : project.descriptionEn
  const challenge = params.locale === 'pt' ? project.challengePt : project.challengeEn
  const solution = params.locale === 'pt' ? project.solutionPt : project.solutionEn
  const results = params.locale === 'pt' ? project.resultsPt : project.resultsEn

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/${params.locale}/portfolio`}
          className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {params.locale === 'pt' ? 'Voltar ao Portfolio' : 'Back to Portfolio'}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-orange" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              {project.categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {project.duration && (
              <div className="text-center">
                <Calendar className="w-8 h-8 text-brand-teal mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">
                  {params.locale === 'pt' ? 'Duração' : 'Duration'}
                </div>
                <div className="font-bold text-lg">{project.duration}</div>
              </div>
            )}
            {project.teamSize && (
              <div className="text-center">
                <Users className="w-8 h-8 text-brand-teal mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">
                  {params.locale === 'pt' ? 'Equipa' : 'Team'}
                </div>
                <div className="font-bold text-lg">
                  {project.teamSize} {params.locale === 'pt' ? 'pessoas' : 'people'}
                </div>
              </div>
            )}
            {project.budgetRange && (
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-brand-teal mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">
                  {params.locale === 'pt' ? 'Orçamento' : 'Budget'}
                </div>
                <div className="font-bold text-lg">{project.budgetRange}</div>
              </div>
            )}
            {project.liveUrl && (
              <div className="text-center">
                <ExternalLink className="w-8 h-8 text-brand-teal mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">
                  {params.locale === 'pt' ? 'Website' : 'Website'}
                </div>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-lg text-brand-teal hover:text-brand-orange transition-colors"
                >
                  {params.locale === 'pt' ? 'Visitar' : 'Visit'}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">
            {params.locale === 'pt' ? 'Sobre o Projeto' : 'About the Project'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </section>

      {/* Challenge, Solution, Results */}
      {project.isCaseStudy && (challenge || solution || results) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">
            {challenge && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-brand-teal">
                  {params.locale === 'pt' ? 'O Desafio' : 'The Challenge'}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {challenge}
                </p>
              </div>
            )}
            {solution && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-brand-teal">
                  {params.locale === 'pt' ? 'A Solução' : 'The Solution'}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {solution}
                </p>
              </div>
            )}
            {results && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-brand-orange">
                  {params.locale === 'pt' ? 'Os Resultados' : 'The Results'}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {results}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Technologies */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">
            {params.locale === 'pt' ? 'Tecnologias Utilizadas' : 'Technologies Used'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.images.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {params.locale === 'pt' ? 'Galeria' : 'Gallery'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-80 rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-teal to-brand-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {params.locale === 'pt' 
              ? 'Gostou deste projeto?' 
              : 'Liked this project?'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {params.locale === 'pt'
              ? 'Vamos criar algo incrível juntos'
              : "Let's create something amazing together"}
          </p>
          <Link
            href={`/${params.locale}/contacto`}
            className="inline-block px-8 py-4 bg-white text-brand-teal font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {params.locale === 'pt' ? 'Iniciar Projeto' : 'Start Project'}
          </Link>
        </div>
      </section>
    </div>
  )
}
