import { NextRequest, NextResponse } from 'next/server'
import { contactSubmissions } from '@/lib/data/contacts'

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/contact/[id] - Get single contact submission
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params
  const submission = contactSubmissions.find(s => s.id === id)

  if (!submission) {
    return NextResponse.json(
      { error: 'Contact submission not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(submission)
}

// PATCH /api/contact/[id] - Update contact submission status
export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()
    const submissionIndex = contactSubmissions.findIndex(s => s.id === id)

    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      )
    }

    // Validate status
    if (body.status && !['new', 'read', 'replied'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, read, replied' },
        { status: 400 }
      )
    }

    const updatedSubmission = {
      ...contactSubmissions[submissionIndex],
      ...body,
      id // Ensure ID doesn't change
    }

    contactSubmissions[submissionIndex] = updatedSubmission

    return NextResponse.json(updatedSubmission)
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// DELETE /api/contact/[id] - Delete contact submission
export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params
  const submissionIndex = contactSubmissions.findIndex(s => s.id === id)

  if (submissionIndex === -1) {
    return NextResponse.json(
      { error: 'Contact submission not found' },
      { status: 404 }
    )
  }

  contactSubmissions.splice(submissionIndex, 1)

  return NextResponse.json(
    { message: 'Contact submission deleted successfully' },
    { status: 200 }
  )
}