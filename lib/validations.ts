import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  sessionId: z.string(),
  locale: z.string().default('pt'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  locale: z.string().default('pt'),
})

export const pageViewSchema = z.object({
  path: z.string(),
  locale: z.string(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
})

export const stripeCheckoutSchema = z.object({
  planId: z.string().cuid(),
  billingCycle: z.enum(['MONTHLY', 'ANNUAL']),
})

export const reviewSubmitSchema = z.object({
  token: z.string(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  projectType: z.string().optional(),
})

// Admin schemas
export const serviceCreateSchema = z.object({
  slug: z.string(),
  category: z.string(),
  titlePt: z.string().min(1),
  titleEn: z.string().min(1),
  shortDescPt: z.string().min(1),
  shortDescEn: z.string().min(1),
  fullDescPt: z.string().min(1),
  fullDescEn: z.string().min(1),
  icon: z.string(),
  technologies: z.array(z.string()),
  processSteps: z.any(),
  faqs: z.any(),
  featuredImage: z.string().optional(),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

export const projectCreateSchema = z.object({
  slug: z.string(),
  title: z.string().min(1),
  categories: z.array(z.string()),
  descriptionPt: z.string().min(1),
  descriptionEn: z.string().min(1),
  challengePt: z.string().optional(),
  challengeEn: z.string().optional(),
  solutionPt: z.string().optional(),
  solutionEn: z.string().optional(),
  resultsPt: z.string().optional(),
  resultsEn: z.string().optional(),
  technologies: z.array(z.string()),
  clientCountry: z.string(),
  liveUrl: z.string().optional(),
  images: z.array(z.string()),
  beforeImages: z.array(z.string()).default([]),
  afterImages: z.array(z.string()).default([]),
  metrics: z.any().optional(),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isCaseStudy: z.boolean().default(false),
  testimonialId: z.string().optional(),
  duration: z.string().optional(),
  teamSize: z.number().optional(),
  budgetRange: z.string().optional(),
  completedAt: z.string().optional(),
})

export const blogPostCreateSchema = z.object({
  slug: z.string(),
  titlePt: z.string().min(1),
  titleEn: z.string().min(1),
  excerptPt: z.string().min(1),
  excerptEn: z.string().min(1),
  bodyPt: z.any(),
  bodyEn: z.any(),
  authorId: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  featuredImage: z.string().optional(),
  readingTimeMinutes: z.number().default(5),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional(),
})

export const teamMemberCreateSchema = z.object({
  name: z.string().min(1),
  rolePt: z.string().min(1),
  roleEn: z.string().min(1),
  bioPt: z.string().min(1),
  bioEn: z.string().min(1),
  photo: z.string().optional(),
  skills: z.array(z.string()),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const pricingPlanCreateSchema = z.object({
  slug: z.string(),
  namePt: z.string().min(1),
  nameEn: z.string().min(1),
  monthlyPrice: z.number(),
  annualPrice: z.number(),
  currency: z.string().default('EUR'),
  features: z.any(),
  isPopular: z.boolean().default(false),
  stripePriceIdMonthly: z.string().optional(),
  stripePriceIdAnnual: z.string().optional(),
  ctaTextPt: z.string().min(1),
  ctaTextEn: z.string().min(1),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})
