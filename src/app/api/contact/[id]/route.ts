import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message: string
  submittedAt: string
  status: 'new' | 'read' | 'replied'
}

const CONTACTS_FILE = path.join(process.cwd(), 'src/lib/data/contacts.json')

// Initialize contacts file if it doesn't exist
async function initContactsFile() {
  try {
    await readFile(CONTACTS_FILE)
  } catch (error) {
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

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/contact/[id] - Get single contact submission
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const contactSubmissions = await readContacts()
    const submission = contactSubmissions.find(s => s.id === id)

    if (!submission) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Failed to get contact:', error)
    return NextResponse.json(
      { error: 'Failed to get contact' },
      { status: 500 }
    )
  }
}

// PATCH /api/contact/[id] - Update contact submission status
export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()
    const contactSubmissions = await readContacts()
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
    await writeContacts(contactSubmissions)

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error('Failed to update contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/contact/[id] - Delete contact submission
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const contactSubmissions = await readContacts()
    const submissionIndex = contactSubmissions.findIndex(s => s.id === id)

    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      )
    }

    contactSubmissions.splice(submissionIndex, 1)
    await writeContacts(contactSubmissions)

    return NextResponse.json(
      { message: 'Contact submission deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}