import { NextRequest, NextResponse } from 'next/server'
import { contactSubmissions, type ContactSubmission } from '@/lib/data/contacts'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const submission: ContactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      projectType: body.projectType?.trim() || '',
      budget: body.budget?.trim() || '',
      message: body.message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new'
    }

    // Store submission
    contactSubmissions.push(submission)

    // In production, you would:
    // 1. Save to database
    // 2. Send notification email to admin
    // 3. Send confirmation email to user
    // 4. Integrate with CRM or project management system

    console.log('New contact submission received:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      submittedAt: submission.submittedAt
    })

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: submission.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get all contact submissions (Admin only)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') as 'new' | 'read' | 'replied' | null

  let filteredSubmissions = contactSubmissions

  if (status) {
    filteredSubmissions = contactSubmissions.filter(submission => submission.status === status)
  }

  // Sort by newest first
  filteredSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  return NextResponse.json({
    submissions: paginatedSubmissions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredSubmissions.length / limit),
      totalSubmissions: filteredSubmissions.length,
      hasNext: endIndex < filteredSubmissions.length,
      hasPrev: page > 1
    },
    stats: {
      total: contactSubmissions.length,
      new: contactSubmissions.filter(s => s.status === 'new').length,
      read: contactSubmissions.filter(s => s.status === 'read').length,
      replied: contactSubmissions.filter(s => s.status === 'replied').length
    }
  })
}