import { NextRequest, NextResponse } from 'next/server'
import { sendCustomReply } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, message, contactId } = body

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'To, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send the reply email
    const result = await sendCustomReply(to, subject, message)

    if (result.success) {
      console.log('Admin reply sent:', {
        contactId,
        to,
        subject,
        messageId: result.messageId
      })

      return NextResponse.json(
        { 
          message: 'Reply sent successfully',
          messageId: result.messageId
        },
        { status: 200 }
      )
    } else {
      console.error('Failed to send reply:', result.error)
      return NextResponse.json(
        { error: `Failed to send reply: ${result.error}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send reply API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}