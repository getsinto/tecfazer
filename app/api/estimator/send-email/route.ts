import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email(),
  locale: z.string().default('pt'),
  estimate: z.object({
    min: z.number(),
    max: z.number(),
    average: z.number(),
    currency: z.string(),
  }),
  timeline: z.object({ weeks: z.number() }),
  breakdown: z.object({
    projectBase: z.object({
      label: z.string(),
      descPt: z.string(),
      descEn: z.string(),
      cost: z.number(),
      hours: z.number(),
    }),
    features: z.array(z.object({
      labelPt: z.string(),
      labelEn: z.string(),
      cost: z.number(),
      hours: z.number(),
    })),
    trafficCost: z.number(),
    designMultiplier: z.number(),
    timelineMultiplier: z.number(),
    totalHours: z.number(),
  }),
  recommendations: z.array(z.object({ pt: z.string(), en: z.string() })),
  formData: z.object({
    projectType: z.string(),
    designComplexity: z.string(),
    timeline: z.string(),
    expectedTraffic: z.string(),
  }),
})

function fmt(n: number) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)
}

function buildHtml(data: z.infer<typeof schema>) {
  const isPt = data.locale === 'pt'
  const { estimate, timeline, breakdown, recommendations } = data
  const date = new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const refNum = `TF-${Date.now().toString().slice(-6)}`

  const featureRows = breakdown.features.map(f => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#475569;">${isPt ? f.labelPt : f.labelEn}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#475569;text-align:right;">${f.hours}h</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:600;text-align:right;">${fmt(f.cost)}</td>
    </tr>`).join('')

  const recItems = recommendations.map(r => `
    <li style="margin-bottom:8px;color:#475569;padding-left:8px;">
      ${isPt ? r.pt : r.en}
    </li>`).join('')

  return `<!DOCTYPE html>
<html lang="${data.locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:640px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1B7A8A,#F5A623);padding:40px 32px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:12px;padding:10px 20px;margin-bottom:16px;">
        <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:1px;">TEC FAZER</span>
      </div>
      <h1 style="color:#fff;margin:0 0 8px;font-size:26px;font-weight:700;">
        ${isPt ? 'Orçamento do Seu Projeto' : 'Your Project Estimate'}
      </h1>
      <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">
        ${isPt ? 'Referência' : 'Reference'}: ${refNum} &nbsp;·&nbsp; ${date}
      </p>
    </div>

    <!-- Price Banner -->
    <div style="background:#f0fdf4;border-bottom:2px solid #bbf7d0;padding:28px 32px;text-align:center;">
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:1px;">
        ${isPt ? 'Investimento Estimado' : 'Estimated Investment'}
      </p>
      <div style="font-size:42px;font-weight:800;color:#1B7A8A;line-height:1.1;">${fmt(estimate.average)}</div>
      <p style="margin:6px 0 0;color:#64748b;font-size:14px;">
        ${isPt ? 'Intervalo' : 'Range'}: ${fmt(estimate.min)} – ${fmt(estimate.max)}
      </p>
      <div style="display:inline-block;margin-top:12px;background:#1B7A8A;color:#fff;border-radius:20px;padding:6px 18px;font-size:13px;font-weight:600;">
        ⏱ ${timeline.weeks} ${isPt ? 'semanas' : 'weeks'} &nbsp;·&nbsp; ~${breakdown.totalHours}h ${isPt ? 'de trabalho' : 'of work'}
      </div>
    </div>

    <!-- Breakdown Table -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;font-size:18px;color:#1e293b;font-weight:700;">
        ${isPt ? 'Detalhamento do Orçamento' : 'Cost Breakdown'}
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 12px;text-align:left;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">${isPt ? 'Item' : 'Item'}</th>
            <th style="padding:10px 12px;text-align:right;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">${isPt ? 'Horas' : 'Hours'}</th>
            <th style="padding:10px 12px;text-align:right;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">${isPt ? 'Custo' : 'Cost'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:600;">
              ${isPt ? breakdown.projectBase.descPt : breakdown.projectBase.descEn}
            </td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#475569;text-align:right;">${breakdown.projectBase.hours}h</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:600;text-align:right;">${fmt(breakdown.projectBase.cost)}</td>
          </tr>
          ${featureRows}
          ${breakdown.trafficCost > 0 ? `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#475569;">${isPt ? 'Infraestrutura de Tráfego' : 'Traffic Infrastructure'}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#475569;text-align:right;">—</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:600;text-align:right;">${fmt(breakdown.trafficCost)}</td>
          </tr>` : ''}
          ${breakdown.designMultiplier !== 1 || breakdown.timelineMultiplier !== 1 ? `
          <tr style="background:#fffbeb;">
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#92400e;font-style:italic;" colspan="2">
              ${isPt ? 'Ajuste de complexidade/prazo' : 'Complexity/timeline adjustment'} (×${(breakdown.designMultiplier * breakdown.timelineMultiplier).toFixed(2)})
            </td>
            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#92400e;font-weight:600;text-align:right;">
              ${fmt(estimate.average - breakdown.projectBase.cost - breakdown.features.reduce((s, f) => s + f.cost, 0) - breakdown.trafficCost)}
            </td>
          </tr>` : ''}
          <tr style="background:#f0fdf4;">
            <td style="padding:12px;font-weight:700;color:#1e293b;font-size:15px;" colspan="2">${isPt ? 'Total Estimado' : 'Estimated Total'}</td>
            <td style="padding:12px;font-weight:800;color:#1B7A8A;font-size:16px;text-align:right;">${fmt(estimate.average)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Recommendations -->
      ${recommendations.length > 0 ? `
      <div style="margin-top:28px;background:#f0f9ff;border-left:4px solid #1B7A8A;border-radius:0 8px 8px 0;padding:20px 24px;">
        <h3 style="margin:0 0 12px;color:#1B7A8A;font-size:15px;font-weight:700;">
          💡 ${isPt ? 'Recomendações' : 'Recommendations'}
        </h3>
        <ul style="margin:0;padding-left:16px;">${recItems}</ul>
      </div>` : ''}

      <!-- CTA -->
      <div style="margin-top:32px;text-align:center;background:linear-gradient(135deg,#1B7A8A15,#F5A62315);border-radius:12px;padding:28px;">
        <p style="margin:0 0 16px;color:#1e293b;font-size:16px;font-weight:600;">
          ${isPt ? 'Pronto para começar o seu projeto?' : 'Ready to start your project?'}
        </p>
        <a href="https://tecfazer.pt/${data.locale}/contacto"
           style="display:inline-block;background:linear-gradient(135deg,#1B7A8A,#F5A623);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
          ${isPt ? 'Falar com a Nossa Equipa' : 'Talk to Our Team'}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">
        Tec Fazer · Mafra, Lisboa, Portugal · info@tecfazer.pt · +351 261 123 456
      </p>
      <p style="margin:0;color:#cbd5e1;font-size:11px;">
        ${isPt ? 'Este orçamento é uma estimativa indicativa. O valor final pode variar após análise detalhada do projeto.' : 'This estimate is indicative. Final price may vary after detailed project analysis.'}
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // No email service configured — return success so UI doesn't show error
      console.log('RESEND_API_KEY not set — skipping email send, returning success')
      return NextResponse.json({ success: true, fallback: true })
    }

    const isPt = data.locale === 'pt'
    const html = buildHtml(data)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Tec Fazer <noreply@tecfazer.pt>',
        to: data.email,
        subject: isPt
          ? `O seu orçamento Tec Fazer — ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(data.estimate.average)}`
          : `Your Tec Fazer estimate — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(data.estimate.average)}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
