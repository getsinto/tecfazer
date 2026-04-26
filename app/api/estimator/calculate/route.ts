import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDbClient } from '@/lib/db'

export const dynamic = 'force-dynamic'

const estimatorSchema = z.object({
  projectType: z.string(),
  features: z.array(z.string()),
  designComplexity: z.enum(['SIMPLE', 'MODERATE', 'COMPLEX']),
  timeline: z.enum(['URGENT', 'NORMAL', 'FLEXIBLE']),
  expectedTraffic: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
  additionalServices: z.array(z.string()).optional(),
})

const DESIGN_MULTIPLIERS = {
  SIMPLE: 1.0,
  MODERATE: 1.3,
  COMPLEX: 1.6,
}

const TIMELINE_MULTIPLIERS = {
  URGENT: 1.5,
  NORMAL: 1.0,
  FLEXIBLE: 0.85,
}

const TRAFFIC_COSTS = {
  LOW: 0,
  MEDIUM: 500,
  HIGH: 1500,
  VERY_HIGH: 3000,
}

// Fallback configurations if database is not available
const FALLBACK_PROJECT_TYPES: Record<string, number> = {
  'Website': 3000,
  'E-commerce': 8000,
  'Web Application': 12000,
  'Mobile App': 15000,
  'Custom Software': 20000,
}

const FALLBACK_FEATURES: Record<string, number> = {
  'User Authentication': 1500,
  'Payment Integration': 2000,
  'Admin Dashboard': 2500,
  'API Integration': 1800,
  'Real-time Features': 3000,
  'Multi-language': 1200,
  'Analytics': 1000,
  'SEO Optimization': 800,
  'Performance Optimization': 1500,
  'Security Audit': 2000,
}

const FALLBACK_SERVICES: Record<string, number> = {
  'Hosting Setup': 500,
  'Domain & SSL': 200,
  'Maintenance (3 months)': 1500,
  'Training': 800,
  'Content Migration': 1200,
  'Marketing Integration': 1000,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = estimatorSchema.parse(body)

    let baseCost = 5000
    let featureCost = 0
    let additionalCost = 0

    try {
      // Try to fetch from database
      const db = getDbClient()
      const configs = await db.estimatorConfig.findMany({
        where: { isActive: true },
      })

      // Calculate base cost from project type
      const projectTypeConfig = configs.find(
        (c) => c.category === 'PROJECT_TYPE' && c.nameEn === data.projectType
      )
      baseCost = projectTypeConfig ? Number(projectTypeConfig.baseCost) : (FALLBACK_PROJECT_TYPES[data.projectType] || 5000)

      // Add feature costs
      for (const feature of data.features) {
        const featureConfig = configs.find(
          (c) => c.category === 'FEATURE' && c.nameEn === feature
        )
        if (featureConfig) {
          featureCost += Number(featureConfig.baseCost)
        } else {
          featureCost += FALLBACK_FEATURES[feature] || 1000
        }
      }

      // Add additional services costs
      if (data.additionalServices) {
        for (const service of data.additionalServices) {
          const serviceConfig = configs.find(
            (c) => c.category === 'ADDITIONAL_SERVICE' && c.nameEn === service
          )
          if (serviceConfig) {
            additionalCost += Number(serviceConfig.baseCost)
          } else {
            additionalCost += FALLBACK_SERVICES[service] || 500
          }
        }
      }
    } catch (dbError) {
      // Use fallback values if database is not available
      console.log('Using fallback estimator values:', dbError)
      baseCost = FALLBACK_PROJECT_TYPES[data.projectType] || 5000
      
      for (const feature of data.features) {
        featureCost += FALLBACK_FEATURES[feature] || 1000
      }
      
      if (data.additionalServices) {
        for (const service of data.additionalServices) {
          additionalCost += FALLBACK_SERVICES[service] || 500
        }
      }
    }

    // Calculate subtotal
    let subtotal = baseCost + featureCost + additionalCost

    // Apply multipliers
    const designMultiplier = DESIGN_MULTIPLIERS[data.designComplexity]
    const timelineMultiplier = TIMELINE_MULTIPLIERS[data.timeline]
    subtotal = subtotal * designMultiplier * timelineMultiplier

    // Add traffic infrastructure cost
    const trafficCost = TRAFFIC_COSTS[data.expectedTraffic]
    subtotal += trafficCost

    // Calculate ranges (±20%)
    const minEstimate = Math.round(subtotal * 0.8)
    const maxEstimate = Math.round(subtotal * 1.2)
    const avgEstimate = Math.round(subtotal)

    // Estimate timeline in weeks
    const complexityWeeks = {
      SIMPLE: 4,
      MODERATE: 8,
      COMPLEX: 12,
    }
    const baseWeeks = complexityWeeks[data.designComplexity]
    const featureWeeks = Math.ceil(data.features.length * 0.5)
    const totalWeeks = baseWeeks + featureWeeks

    // Adjust for timeline urgency
    const timelineWeeks = data.timeline === 'URGENT' 
      ? Math.ceil(totalWeeks * 0.7) 
      : data.timeline === 'FLEXIBLE'
      ? Math.ceil(totalWeeks * 1.2)
      : totalWeeks

    return NextResponse.json({
      estimate: {
        min: minEstimate,
        max: maxEstimate,
        average: avgEstimate,
        currency: 'EUR',
      },
      timeline: {
        weeks: timelineWeeks,
        description: data.timeline === 'URGENT' 
          ? 'Expedited delivery with dedicated team'
          : data.timeline === 'FLEXIBLE'
          ? 'Standard delivery with optimal resource allocation'
          : 'Balanced delivery timeline',
      },
      breakdown: {
        baseProjectCost: baseCost,
        featuresCost: featureCost,
        additionalServicesCost: additionalCost,
        designComplexityMultiplier: designMultiplier,
        timelineMultiplier: timelineMultiplier,
        trafficInfrastructureCost: trafficCost,
      },
      recommendations: generateRecommendations(data),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Estimator calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate estimate' },
      { status: 500 }
    )
  }
}

function generateRecommendations(data: z.infer<typeof estimatorSchema>): string[] {
  const recommendations: string[] = []

  if (data.designComplexity === 'COMPLEX' && data.timeline === 'URGENT') {
    recommendations.push('Consider extending timeline for better quality and cost optimization')
  }

  if (data.expectedTraffic === 'VERY_HIGH' && !data.features.includes('Performance Optimization')) {
    recommendations.push('Add performance optimization for high-traffic applications')
  }

  if (data.features.includes('E-commerce') && !data.features.includes('Payment Integration')) {
    recommendations.push('Payment integration is essential for e-commerce projects')
  }

  if (data.features.includes('User Authentication') && !data.features.includes('Security Audit')) {
    recommendations.push('Security audit recommended for applications with user authentication')
  }

  if (data.timeline === 'FLEXIBLE') {
    recommendations.push('Flexible timeline allows for iterative development and cost savings')
  }

  return recommendations
}
