import { NextRequest, NextResponse } from 'next/server'
import { projects, type Project } from '@/lib/data/projects'

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')

  let filteredProjects = projects

  if (category) {
    filteredProjects = projects.filter(project => project.category === category)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  return NextResponse.json({
    projects: paginatedProjects,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProjects.length / limit),
      totalProjects: filteredProjects.length,
      hasNext: endIndex < filteredProjects.length,
      hasPrev: page > 1
    }
  })
}

// POST /api/projects - Create new project (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    projects.push(newProject)

    return NextResponse.json(newProject, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}