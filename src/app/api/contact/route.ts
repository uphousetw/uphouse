import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message?: string
  submittedAt: string
  status: 'new' | 'read' | 'replied'
}

const CONTACTS_FILE = path.join(process.cwd(), 'src/lib/data/contacts.json')

// Initialize contacts file if it doesn't exist
async function initContactsFile() {
  try {
    await readFile(CONTACTS_FILE)
  } catch {
    // File doesn't exist, create it
    const initialData = { submissions: [] }
    await writeFile(CONTACTS_FILE, JSON.stringify(initialData, null, 2))
  }
}

// Read contacts from file
async function readContacts() {
  await initContactsFile()
  const data = await readFile(CONTACTS_FILE, 'utf-8')
  const contactData = JSON.parse(data)
  return contactData.submissions || []
}

// Write contacts to file
async function writeContacts(submissions: ContactSubmission[]) {
  const contactData = { submissions }
  await writeFile(CONTACTS_FILE, JSON.stringify(contactData, null, 2))
}

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Validate Taiwan phone number format
    const cleanPhone = body.phone.replace(/[\s-]/g, '')
    const phoneRegex = /^(?:09\d{8}|0[2-8]\d{7,8}|070\d{7}|080[09]\d{6})$/
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Taiwan phone number format (e.g., 02-12345678, 0912345678, 070-1234567, 0800123456)' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (body.email && body.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
    }

    const submission: ContactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      projectType: body.projectType?.trim() || '',
      budget: body.budget?.trim() || '',
      message: body.message?.trim() || '',
      submittedAt: new Date().toISOString(),
      status: 'new'
    }

    // Store submission
    const currentSubmissions = await readContacts()
    currentSubmissions.push(submission)
    await writeContacts(currentSubmissions)

    // Send email notifications (don't block response on email failures)
    Promise.all([
      sendContactNotification(submission),
      sendContactConfirmation(submission)
    ]).then(([adminResult, confirmResult]) => {
      console.log('Email notifications sent:', {
        admin: adminResult.success ? 'Success' : `Failed: ${adminResult.error}`,
        confirmation: confirmResult.success ? 'Success' : `Failed: ${confirmResult.error}`
      })
    }).catch(error => {
      console.error('Email notification error:', error)
    })

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
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as 'new' | 'read' | 'replied' | null

    const contactSubmissions = await readContacts()
    let filteredSubmissions = contactSubmissions

    if (status) {
      filteredSubmissions = contactSubmissions.filter((submission: ContactSubmission) => submission.status === status)
    }

    // Sort by newest first
    filteredSubmissions.sort((a: ContactSubmission, b: ContactSubmission) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

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
        new: contactSubmissions.filter((s: ContactSubmission) => s.status === 'new').length,
        read: contactSubmissions.filter((s: ContactSubmission) => s.status === 'read').length,
        replied: contactSubmissions.filter((s: ContactSubmission) => s.status === 'replied').length
      }
    })
  } catch (error) {
    console.error('Failed to load contacts:', error)
    return NextResponse.json(
      { error: 'Failed to load contacts' },
      { status: 500 }
    )
  }
}