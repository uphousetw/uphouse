import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, addProject, updateProject } from '@/lib/storage/projectStorage'
import { getAllNetlifyProjects, createNetlifyProject } from '@/lib/netlify-cms'

// GET /api/projects - Get all projects with caching
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  const useNetlify = searchParams.get('netlify') === 'true'

  let filteredProjects

  if (useNetlify) {
    // Use Netlify CMS data
    filteredProjects = getAllNetlifyProjects().map((project, index) => ({
      id: index + 1,
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  } else {
    // Use existing file storage
    filteredProjects = getAllProjects()
  }

  if (category) {
    filteredProjects = filteredProjects.filter(project => project.category === category)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  const response = NextResponse.json({
    projects: paginatedProjects,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProjects.length / limit),
      totalProjects: filteredProjects.length,
      hasNext: endIndex < filteredProjects.length,
      hasPrev: page > 1
    }
  })

  // Add caching headers
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=600')

  return response
}

// POST /api/projects - Create new project (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const useNetlify = body.useNetlify === true

    const projectData = {
      title: body.title,
      description: body.description,
      fullDescription: body.fullDescription,
      image: body.image || "/api/placeholder/800/600",
      completionDate: body.completionDate,
      category: body.category,
      location: body.location,
      area: body.area,
      features: body.features || [],
      gallery: body.gallery || [],
      brandLogos: body.brandLogos || []
    }

    if (useNetlify) {
      // Create in Netlify CMS format
      createNetlifyProject(projectData)
      return NextResponse.json({ message: 'Project created in Netlify CMS', data: projectData }, { status: 201 })
    } else {
      // Use existing file storage
      const newProject = addProject(projectData)
      return NextResponse.json(newProject, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects - Update existing project (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const updatedProject = updateProject(parseInt(id), updateData)

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}