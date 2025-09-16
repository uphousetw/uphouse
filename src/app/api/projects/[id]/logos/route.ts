import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Mock database - in production, you'd use a real database
const projectLogos: { [key: string]: string[] } = {
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': []
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const logos = projectLogos[id] || []
    
    return NextResponse.json({ logos })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch logos' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const files = formData.getAll('logos') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos', id)
    
    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedLogos: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `logo_${timestamp}.${extension}`
      const filepath = path.join(uploadDir, filename)
      
      await writeFile(filepath, buffer)
      
      const logoUrl = `/uploads/logos/${id}/${filename}`
      uploadedLogos.push(logoUrl)
    }

    // Update mock database
    if (!projectLogos[id]) {
      projectLogos[id] = []
    }
    projectLogos[id].push(...uploadedLogos)

    return NextResponse.json({ 
      message: 'Logos uploaded successfully',
      logos: uploadedLogos
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload logos' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { logoUrl } = await request.json()
    
    if (!projectLogos[id]) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Remove logo from project
    projectLogos[id] = projectLogos[id].filter(logo => logo !== logoUrl)

    return NextResponse.json({ 
      message: 'Logo removed successfully',
      logos: projectLogos[id]
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to remove logo' },
      { status: 500 }
    )
  }
}