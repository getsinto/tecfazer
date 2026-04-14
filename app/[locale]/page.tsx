import HeroSection from '@/components/sections/HeroSection'
import StatsBar from '@/components/sections/StatsBar'
import ServicesOverview from '@/components/sections/ServicesOverview'
import CoreExpertise from '@/components/sections/CoreExpertise'
import PortfolioPreview from '@/components/sections/PortfolioPreview'
import FeaturedCaseStudies from '@/components/sections/FeaturedCaseStudies'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import TestimonialsCarousel from '@/components/sections/TestimonialsCarousel'
import PricingSection from '@/components/sections/PricingSection'
import PartnersBar from '@/components/sections/PartnersBar'
import BlogPreview from '@/components/sections/BlogPreview'
import ContactSection from '@/components/sections/ContactSection'
import db from '@/lib/db'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Tec Fazer — Desenvolvimento Web e Tecnologia em Portugal',
    titleEn: 'Tec Fazer — Web Development and Technology in Portugal',
    descPt: 'Empresa de tecnologia em Mafra Lisboa especializada em desenvolvimento web, mobile, cloud e marketing digital. Mais de 300 projetos concluídos.',
    descEn: 'Technology company in Mafra Lisbon specializing in web, mobile, cloud development and digital marketing. Over 300 completed projects.',
    path: '/',
  })
}

export default async function HomePage() {
  // Fetch data for sections
  const [projects, testimonials, plans] = await Promise.all([
    db.project.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }).catch(() => []),
    db.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }).catch(() => []),
    db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }).catch(() => []),
  ])

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesOverview />
      <CoreExpertise />
      <PortfolioPreview projects={projects} />
      <FeaturedCaseStudies />
      <WhyChooseUs />
      <TestimonialsCarousel testimonials={testimonials} />
      <PricingSection plans={plans} />
      <PartnersBar />
      <BlogPreview />
      <ContactSection />
    </>
  )
}
