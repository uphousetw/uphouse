import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

const HERO_IMAGES_FILE = path.join(process.cwd(), 'src/lib/data/hero-images.json')

// Initialize hero images file if it doesn't exist
async function initHeroImagesFile() {
  try {
    await readFile(HERO_IMAGES_FILE)
  } catch {
    // File doesn't exist, create it
    const initialData = { images: [] }
    await writeFile(HERO_IMAGES_FILE, JSON.stringify(initialData, null, 2))
  }
}

export async function GET() {
  try {
    await initHeroImagesFile()
    const data = await readFile(HERO_IMAGES_FILE, 'utf-8')
    const heroData = JSON.parse(data)
    
    return NextResponse.json(heroData)
  } catch (error) {
    console.error('Failed to load hero images:', error)
    return NextResponse.json(
      { error: 'Failed to load hero images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images } = body

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Images must be an array' },
        { status: 400 }
      )
    }

    await initHeroImagesFile()
    
    const heroData = { images }
    await writeFile(HERO_IMAGES_FILE, JSON.stringify(heroData, null, 2))
    
    return NextResponse.json({
      message: 'Hero images updated successfully',
      images
    })
  } catch (error) {
    console.error('Failed to update hero images:', error)
    return NextResponse.json(
      { error: 'Failed to update hero images' },
      { status: 500 }
    )
  }
}