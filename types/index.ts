import { Service, Project, BlogPost, PricingPlan, User, BlogComment, Order, ClientUser } from '@prisma/client'

// Service types
export type ServiceWithRelations = Service

// Project types
export type ProjectWithRelations = Project & {
  clientUser: ClientUser | null
}

// Blog types
export type BlogPostWithAuthor = BlogPost & {
  author: User
  comments: BlogComment[]
}

// Pricing types
export type PricingPlanWithOrders = PricingPlan & {
  orders: Order[]
}

// Process step type
export interface ProcessStep {
  stepNumber: number
  titlePt: string
  titleEn: string
  descPt: string
  descEn: string
}

// FAQ type
export interface FAQ {
  questionPt: string
  questionEn: string
  answerPt: string
  answerEn: string
}

// Pricing feature type
export interface PricingFeature {
  textPt: string
  textEn: string
  included: boolean
}

// Metrics type
export interface Metric {
  label: string
  value: string
  suffix?: string
}

// Generated content type
export interface GeneratedContent {
  titlePt: string
  titleEn: string
  descriptionPt: string
  descriptionEn: string
  contentPt?: string
  contentEn?: string
  metaTitlePt?: string
  metaTitleEn?: string
  metaDescPt?: string
  metaDescEn?: string
}

// Estimator result type
export interface EstimatorResult {
  min: number
  max: number
  breakdown: Array<{
    item: string
    cost: number
  }>
  recommendedTechnologies: string[]
  estimatedWeeks: number
  recommendedPlan: string
}

// Chat message type
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

// Analytics types
export interface DailyCount {
  date: string
  count: number
}

export interface PageCount {
  path: string
  count: number
}

export interface ReferrerCount {
  referrer: string
  count: number
}

export interface AnalyticsData {
  pageViews: DailyCount[]
  topPages: PageCount[]
  referrers: ReferrerCount[]
  localeBreakdown: {
    pt: number
    en: number
  }
  leadsOverTime: DailyCount[]
  revenueOverTime: Array<{
    month: string
    revenue: number
  }>
  servicesInterest: Array<{
    service: string
    count: number
  }>
  chatStats: {
    total: number
    avgMessages: number
    escalationRate: number
  }
}

// Import/Export types
export interface ImportPreviewRow {
  data: Record<string, unknown>
  valid: boolean
  errors: string[]
}

export interface ImportResult {
  preview?: ImportPreviewRow[]
  upserted?: number
  errors?: string[]
}
