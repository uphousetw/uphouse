import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    console.log('File:', file ? file.name : 'null', 'Folder:', folder)

    if (!file) {
      console.error('No file provided in upload request')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (only images)
    console.log('File type:', file.type, 'File size:', file.size)
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      )
    }

    console.log('Processing file upload...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${cleanName}`

    // Create upload directory path
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    console.log('Upload directory:', uploadDir)

    try {
      await mkdir(uploadDir, { recursive: true })
      console.log('Directory created/verified:', uploadDir)
    } catch (dirError) {
      console.error('Directory creation error:', dirError)
    }

    // Save file
    const filePath = path.join(uploadDir, filename)
    console.log('Saving file to:', filePath)
    await writeFile(filePath, buffer)
    console.log('File saved successfully')

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    )
  }
}