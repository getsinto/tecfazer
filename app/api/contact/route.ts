import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { leadConfirmation } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)

    // Create lead in database
    const lead = await db.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        serviceInterest: validatedData.serviceInterest || null,
        budgetRange: validatedData.budgetRange || null,
        timeline: validatedData.timeline || null,
        message: validatedData.message,
        status: 'NEW',
        source: 'WEBSITE',
      },
    })

    // Get all SUPER_ADMIN users for notifications
    const admins = await db.user.findMany({
      where: { role: 'SUPER_ADMIN' },
    })

    // Create notifications for admins
    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          type: 'NEW_LEAD',
          title: 'New Contact Form Submission',
          message: `${validatedData.name} submitted a contact form`,
          relatedEntityType: 'Lead',
          relatedEntityId: lead.id,
        },
      })
    }

    // Send confirmation email to user
    try {
      await sendEmail(
        validatedData.email,
        'Obrigado pelo seu contacto - Tec Fazer',
        leadConfirmation(validatedData.name, validatedData.serviceInterest || '', 'pt')
      )
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL || 'geral@tecfazer.pt',
        `New Lead: ${validatedData.name}`,
        `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${validatedData.company || 'N/A'}</p>
          <p><strong>Service:</strong> ${validatedData.serviceInterest || 'N/A'}</p>
          <p><strong>Budget:</strong> ${validatedData.budgetRange || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message}</p>
        `
      )
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
    }

    return NextResponse.json(
      { id: lead.id, message: 'Contact form submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}
