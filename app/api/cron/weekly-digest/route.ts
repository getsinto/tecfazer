import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range (last 7 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    // Fetch weekly metrics
    const [
      newLeads,
      newOrders,
      newReviews,
      pageViews,
      newSubscribers,
    ] = await Promise.all([
      db.lead.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      db.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      db.review.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      db.pageView.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      db.newsletterSubscriber.count({
        where: {
          subscribedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ])

    // Calculate revenue
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'PAID',
      },
    })

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0)

    // Get top pages
    const topPages = await db.pageView.groupBy({
      by: ['path'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        path: true,
      },
      orderBy: {
        _count: {
          path: 'desc',
        },
      },
      take: 5,
    })

    // Generate email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1B7A8A 0%, #F5A623 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Resumo Semanal</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">
            ${startDate.toLocaleDateString('pt-PT')} - ${endDate.toLocaleDateString('pt-PT')}
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 30px;">
          <h2 style="color: #1B7A8A; margin-top: 0;">Métricas da Semana</h2>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #1B7A8A;">💰 Receita Total</strong>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <strong style="font-size: 20px;">€${totalRevenue.toFixed(2)}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #1B7A8A;">📝 Novos Leads</strong>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <strong style="font-size: 20px;">${newLeads}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #1B7A8A;">🛒 Novos Pedidos</strong>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <strong style="font-size: 20px;">${newOrders}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #1B7A8A;">⭐ Novas Avaliações</strong>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <strong style="font-size: 20px;">${newReviews}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #1B7A8A;">👁️ Visualizações</strong>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <strong style="font-size: 20px;">${pageViews.toLocaleString()}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 15px;">
                  <strong style="color: #1B7A8A;">📧 Novos Subscritores</strong>
                </td>
                <td style="padding: 15px; text-align: right;">
                  <strong style="font-size: 20px;">${newSubscribers}</strong>
                </td>
              </tr>
            </table>
          </div>

          <h3 style="color: #1B7A8A;">📈 Top 5 Páginas</h3>
          <div style="background: white; border-radius: 8px; padding: 20px;">
            <ol style="margin: 0; padding-left: 20px;">
              ${topPages.map((page) => `
                <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong>${page.path}</strong>
                  <span style="color: #666; float: right;">${page._count.path} visualizações</span>
                </li>
              `).join('')}
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/analytics" 
               style="display: inline-block; background: linear-gradient(135deg, #1B7A8A 0%, #F5A623 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Ver Dashboard Completo
            </a>
          </div>
        </div>

        <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">
            Tec Fazer - Building The Future
          </p>
        </div>
      </div>
    `

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tecfazer.pt'
    await sendEmail(
      adminEmail,
      '📊 Resumo Semanal - Tec Fazer',
      emailHtml
    )

    return NextResponse.json({
      success: true,
      metrics: {
        newLeads,
        newOrders,
        newReviews,
        pageViews,
        newSubscribers,
        totalRevenue,
      },
    })
  } catch (error) {
    console.error('Weekly digest error:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly digest' },
      { status: 500 }
    )
  }
}
