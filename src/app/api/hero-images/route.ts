import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { getAllNetlifyHeroImages, createNetlifyHeroImage } from '@/lib/netlify-cms'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useNetlify = searchParams.get('netlify') === 'true'

    if (useNetlify) {
      // Use Netlify CMS data
      const netlifyImages = getAllNetlifyHeroImages()
      return NextResponse.json({ images: netlifyImages })
    } else {
      // Use existing file storage
      await initHeroImagesFile()
      const data = await readFile(HERO_IMAGES_FILE, 'utf-8')
      const heroData = JSON.parse(data)

      return NextResponse.json(heroData)
    }
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
    const { images, useNetlify } = body

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Images must be an array' },
        { status: 400 }
      )
    }

    if (useNetlify) {
      // Create in Netlify CMS format
      images.forEach((image, index) => {
        createNetlifyHeroImage({
          title: image.title || `Hero Image ${index + 1}`,
          image: image.image,
          description: image.description,
          order: image.order || index + 1
        })
      })

      return NextResponse.json({
        message: 'Hero images created in Netlify CMS',
        images
      })
    } else {
      // Use existing file storage
      await initHeroImagesFile()

      const heroData = { images }
      await writeFile(HERO_IMAGES_FILE, JSON.stringify(heroData, null, 2))

      return NextResponse.json({
        message: 'Hero images updated successfully',
        images
      })
    }
  } catch (error) {
    console.error('Failed to update hero images:', error)
    return NextResponse.json(
      { error: 'Failed to update hero images' },
      { status: 500 }
    )
  }
}