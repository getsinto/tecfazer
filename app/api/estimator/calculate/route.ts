import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const estimatorSchema = z.object({
  projectType: z.string(),
  features: z.array(z.string()),
  designComplexity: z.enum(['SIMPLE', 'MODERATE', 'COMPLEX']),
  timeline: z.enum(['URGENT', 'NORMAL', 'FLEXIBLE']),
  expectedTraffic: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
})

// ─── Realistic market rates (Fiverr/Upwork mid-tier freelancer, Portugal market) ───

// Base project cost in EUR — reflects real mid-market rates
const PROJECT_BASE: Record<string, { cost: number; hours: number; descPt: string; descEn: string }> = {
  'website': {
    cost: 450,
    hours: 30,
    descPt: 'Website corporativo com até 8 páginas, design responsivo e formulário de contacto',
    descEn: 'Corporate website up to 8 pages, responsive design and contact form',
  },
  'ecommerce': {
    cost: 900,
    hours: 60,
    descPt: 'Loja online com catálogo de produtos, carrinho e checkout',
    descEn: 'Online store with product catalog, cart and checkout',
  },
  'web-app': {
    cost: 1400,
    hours: 90,
    descPt: 'Aplicação web com painel de utilizador, base de dados e lógica de negócio',
    descEn: 'Web application with user panel, database and business logic',
  },
  'mobile-app': {
    cost: 1800,
    hours: 120,
    descPt: 'App móvel nativa ou híbrida para iOS e Android',
    descEn: 'Native or hybrid mobile app for iOS and Android',
  },
  'custom': {
    cost: 2200,
    hours: 150,
    descPt: 'Software personalizado com integrações e fluxos de trabalho específicos',
    descEn: 'Custom software with specific integrations and workflows',
  },
}

// Feature add-on costs — realistic per-feature rates
const FEATURE_COSTS: Record<string, { cost: number; hours: number; labelPt: string; labelEn: string }> = {
  'user-auth':    { cost: 120, hours: 8,  labelPt: 'Autenticação de Utilizadores', labelEn: 'User Authentication' },
  'payment':      { cost: 200, hours: 12, labelPt: 'Integração de Pagamentos',     labelEn: 'Payment Integration' },
  'cms':          { cost: 180, hours: 10, labelPt: 'Gestão de Conteúdo (CMS)',      labelEn: 'Content Management (CMS)' },
  'api':          { cost: 150, hours: 10, labelPt: 'API REST',                      labelEn: 'REST API' },
  'analytics':    { cost: 80,  hours: 5,  labelPt: 'Analytics e Relatórios',        labelEn: 'Analytics & Reports' },
  'notifications':{ cost: 100, hours: 6,  labelPt: 'Notificações Push',             labelEn: 'Push Notifications' },
  'search':       { cost: 90,  hours: 6,  labelPt: 'Pesquisa Avançada',             labelEn: 'Advanced Search' },
  'multilingual': { cost: 130, hours: 8,  labelPt: 'Multi-idioma',                  labelEn: 'Multi-language' },
  'seo':          { cost: 100, hours: 6,  labelPt: 'Otimização SEO',                labelEn: 'SEO Optimization' },
  'security':     { cost: 150, hours: 8,  labelPt: 'Auditoria de Segurança',        labelEn: 'Security Audit' },
}

const DESIGN_MULTIPLIERS = { SIMPLE: 1.0, MODERATE: 1.25, COMPLEX: 1.55 }
const TIMELINE_MULTIPLIERS = { URGENT: 1.35, NORMAL: 1.0, FLEXIBLE: 0.9 }
const TRAFFIC_COSTS = { LOW: 0, MEDIUM: 60, HIGH: 150, VERY_HIGH: 300 }

// Timeline in weeks per complexity
const BASE_WEEKS = { SIMPLE: 2, MODERATE: 4, COMPLEX: 7 }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = estimatorSchema.parse(body)

    const project = PROJECT_BASE[data.projectType] ?? PROJECT_BASE['website']
    let baseCost = project.cost
    let totalHours = project.hours

    // Feature line items
    const featureLineItems: { labelPt: string; labelEn: string; cost: number; hours: number }[] = []
    for (const fid of data.features) {
      const f = FEATURE_COSTS[fid]
      if (f) {
        featureLineItems.push(f)
        baseCost += f.cost
        totalHours += f.hours
      }
    }

    // Traffic infra
    const trafficCost = TRAFFIC_COSTS[data.expectedTraffic]
    baseCost += trafficCost

    // Apply multipliers
    const dm = DESIGN_MULTIPLIERS[data.designComplexity]
    const tm = TIMELINE_MULTIPLIERS[data.timeline]
    const subtotal = Math.round(baseCost * dm * tm)

    // ±15% range
    const minEstimate = Math.round(subtotal * 0.85)
    const maxEstimate = Math.round(subtotal * 1.15)

    // Timeline
    const baseWeeks = BASE_WEEKS[data.designComplexity]
    const featureWeeks = Math.ceil(data.features.length * 0.4)
    let weeks = baseWeeks + featureWeeks
    if (data.timeline === 'URGENT') weeks = Math.max(1, Math.ceil(weeks * 0.7))
    if (data.timeline === 'FLEXIBLE') weeks = Math.ceil(weeks * 1.2)

    return NextResponse.json({
      estimate: { min: minEstimate, max: maxEstimate, average: subtotal, currency: 'EUR' },
      timeline: { weeks },
      breakdown: {
        projectBase: { label: data.projectType, descPt: project.descPt, descEn: project.descEn, cost: project.cost, hours: project.hours },
        features: featureLineItems,
        trafficCost,
        designMultiplier: dm,
        timelineMultiplier: tm,
        totalHours,
      },
      recommendations: buildRecommendations(data),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    console.error('Estimator error:', error)
    return NextResponse.json({ error: 'Failed to calculate estimate' }, { status: 500 })
  }
}

function buildRecommendations(data: z.infer<typeof estimatorSchema>) {
  const recs: { pt: string; en: string }[] = []

  if (data.timeline === 'URGENT' && data.designComplexity === 'COMPLEX') {
    recs.push({
      pt: 'Design complexo com prazo urgente aumenta o custo em ~35%. Considere um prazo normal para poupar.',
      en: 'Complex design with urgent timeline adds ~35% cost. Consider a normal timeline to save.',
    })
  }
  if (data.features.includes('payment') && !data.features.includes('security')) {
    recs.push({
      pt: 'Projetos com pagamentos devem incluir auditoria de segurança — protege os seus clientes.',
      en: 'Projects with payments should include a security audit — it protects your customers.',
    })
  }
  if (data.features.includes('user-auth') && !data.features.includes('security')) {
    recs.push({
      pt: 'Com autenticação de utilizadores, recomendamos adicionar auditoria de segurança.',
      en: 'With user authentication, we recommend adding a security audit.',
    })
  }
  if (data.expectedTraffic === 'HIGH' || data.expectedTraffic === 'VERY_HIGH') {
    recs.push({
      pt: 'Para alto tráfego, planeie hosting dedicado (€20-80/mês) além deste orçamento.',
      en: 'For high traffic, plan for dedicated hosting (€20-80/month) on top of this budget.',
    })
  }
  if (data.timeline === 'FLEXIBLE') {
    recs.push({
      pt: 'Prazo flexível permite desenvolvimento iterativo e poupa até 10% no custo total.',
      en: 'Flexible timeline enables iterative development and saves up to 10% on total cost.',
    })
  }
  if (data.features.length === 0) {
    recs.push({
      pt: 'Adicionar funcionalidades como SEO ou CMS aumenta o valor do projeto para os seus clientes.',
      en: 'Adding features like SEO or CMS increases the value of the project for your clients.',
    })
  }

  return recs
}
