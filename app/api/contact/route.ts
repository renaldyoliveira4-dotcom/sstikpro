import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // In production: send email via Resend/SendGrid or store in Supabase
    // await resend.emails.send({ from: 'noreply@sstikpro.com', to: 'support@sstikpro.com', ... })

    console.log('[Contact Form]', data)
    return NextResponse.json({ success: true, message: 'Message received. We will respond within 24 hours.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
