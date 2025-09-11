import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (only images)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${cleanName}`

    // Create upload directory path
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.log('Directory already exists or created')
    }

    // Save file
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/images/${folder}/${filename}`

    console.log(`File uploaded successfully: ${publicUrl}`)

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}