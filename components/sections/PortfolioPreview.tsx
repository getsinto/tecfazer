'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'

interface Project {
  id: string
  slug: string
  title: string
  categories: string[]
  descriptionPt: string
  technologies: string[]
  clientCountry: string
  images: string[]
  liveUrl: string | null
  isFeatured: boolean
}

interface PortfolioPreviewProps {
  projects: Project[]
}

export default function PortfolioPreview({ projects }: PortfolioPreviewProps) {
  const t = useTranslations('portfolio')
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = ['all', 'mobile', 'webApp', 'ecommerce', 'website']

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter))

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
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('sectionSubtitle')}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t(`filters.${filter}`)}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.images[0] || '/images/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-3 p-4">
                      <Link
                        href={`/pt/portfolio/${project.slug}`}
                        className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
                      >
                        Ver Projeto
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-semibold hover:bg-brand-teal/90 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {project.descriptionPt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* View all button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white"
            >
              <Link href="/pt/portfolio">
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
