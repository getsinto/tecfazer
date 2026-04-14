'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StarRating from '@/components/ui/StarRating'
import SectionReveal from '@/components/ui/SectionReveal'

interface Testimonial {
  id: string
  clientName: string
  company: string
  country: string
  photo: string | null
  rating: number
  reviewPt: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const t = useTranslations('testimonials')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  if (testimonials.length === 0) return null

  // Calculate aggregate rating
  const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  return (
    <SectionReveal>
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/20 text-brand-orange font-semibold text-sm mb-4">
              {t('sectionBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('sectionTitle')}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              {t('sectionSubtitle')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <StarRating rating={avgRating} />
              <span className="text-sm text-slate-400">
                {t('aggregateLabel', { count: testimonials.length })}
              </span>
            </div>
          </div>

          {/* Carousel */}
          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative"
              >
                <Quote className="absolute top-6 left-6 h-12 w-12 text-brand-orange/30" />
                
                <div className="relative z-10">
                  <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].reviewPt}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {testimonials[currentIndex].photo ? (
                      <img
                        src={testimonials[currentIndex].photo!}
                        alt={testimonials[currentIndex].clientName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center text-2xl font-bold">
                        {testimonials[currentIndex].clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-lg">{testimonials[currentIndex].clientName}</div>
                      <div className="text-slate-300">
                        {testimonials[currentIndex].company} • {testimonials[currentIndex].country}
                      </div>
                      <StarRating rating={testimonials[currentIndex].rating} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-brand-orange w-8'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
