'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const t = useTranslations('hero')
  const techStack = t.raw('techStack') as string[]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-teal/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-brand-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-teal/20 to-brand-orange/20 border border-brand-teal/30 text-sm font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">{t('headline')} </span>
            <span className="bg-gradient-to-r from-brand-teal via-brand-orange to-brand-teal bg-clip-text text-transparent animate-gradient">
              {t('headlineHighlight')}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/pt/contacto">
                {t('primaryCta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all"
            >
              <Link href="/pt/portfolio">
                {t('secondaryCta')}
              </Link>
            </Button>
          </motion.div>

          {/* Tech stack badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-0"
          >
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white/90 transition-colors cursor-pointer">
            <span className="text-sm font-medium">{t('scrollHint')}</span>
            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
