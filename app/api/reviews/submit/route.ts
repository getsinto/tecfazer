import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { sendEmail } from '@/lib/email'

const reviewSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  clientCompany: z.string().optional(),
  clientCountry: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  projectType: z.string().optional(),
  serviceUsed: z.string().optional(),
  verificationToken: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = reviewSchema.parse(body)

    // Check if verification token is provided and valid
    let isVerified = false
    if (data.verificationToken) {
      const reviewRequest = await db.reviewRequest.findUnique({
        where: { token: data.verificationToken },
      })

      if (reviewRequest && !reviewRequest.submittedAt) {
        isVerified = true
        // Mark the review request as submitted
        await db.reviewRequest.update({
          where: { id: reviewRequest.id },
          data: { submittedAt: new Date() },
        })
      }
    }

    // Create the review
    const review = await db.review.create({
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientCompany: data.clientCompany,
        clientCountry: data.clientCountry,
        rating: data.rating,
        reviewText: data.reviewText,
        projectType: data.projectType,
        serviceUsed: data.serviceUsed,
        verificationToken: data.verificationToken,
        isVerified,
        isPublished: false, // Admin must approve before publishing
        source: 'DIRECT',
      },
    })

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tecfazer.pt'
    await sendEmail(
      adminEmail,
      `Nova Avaliação Recebida - ${data.rating} estrelas`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B7A8A;">Nova Avaliação Recebida</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Cliente:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            ${data.clientCompany ? `<p><strong>Empresa:</strong> ${data.clientCompany}</p>` : ''}
            ${data.clientCountry ? `<p><strong>País:</strong> ${data.clientCountry}</p>` : ''}
            <p><strong>Classificação:</strong> ${'⭐'.repeat(data.rating)}</p>
            <p><strong>Avaliação:</strong></p>
            <p style="white-space: pre-wrap;">${data.reviewText}</p>
            ${data.projectType ? `<p><strong>Tipo de Projeto:</strong> ${data.projectType}</p>` : ''}
            ${data.serviceUsed ? `<p><strong>Serviço Utilizado:</strong> ${data.serviceUsed}</p>` : ''}
            <p><strong>Verificado:</strong> ${isVerified ? 'Sim ✓' : 'Não'}</p>
          </div>
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews" 
               style="background: linear-gradient(135deg, #1B7A8A 0%, #F5A623 100%); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;">
              Ver no Admin
            </a>
          </p>
        </div>
      `
    ).catch((err) => console.error('Failed to send admin notification:', err))

    // Send thank you email to client
    await sendEmail(
      data.clientEmail,
      'Obrigado pela sua avaliação! | Thank you for your review!',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B7A8A;">Obrigado pela sua avaliação!</h2>
          <p>Olá ${data.clientName},</p>
          <p>Muito obrigado por partilhar a sua experiência connosco. O seu feedback é extremamente valioso e ajuda-nos a melhorar continuamente os nossos serviços.</p>
          <p>A sua avaliação será revista pela nossa equipa e publicada em breve no nosso website.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>A sua classificação:</strong> ${'⭐'.repeat(data.rating)}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          <h2 style="color: #1B7A8A;">Thank you for your review!</h2>
          <p>Hello ${data.clientName},</p>
          <p>Thank you so much for sharing your experience with us. Your feedback is extremely valuable and helps us continuously improve our services.</p>
          <p>Your review will be reviewed by our team and published soon on our website.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your rating:</strong> ${'⭐'.repeat(data.rating)}</p>
          </div>
          <p style="margin-top: 30px;">
            <strong>Tec Fazer</strong><br />
            Building The Future<br />
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #1B7A8A;">www.tecfazer.pt</a>
          </p>
        </div>
      `
    ).catch((err) => console.error('Failed to send thank you email:', err))

    return NextResponse.json({
      success: true,
      reviewId: review.id,
      message: 'Review submitted successfully',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
