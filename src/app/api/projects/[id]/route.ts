import { NextRequest, NextResponse } from 'next/server'
import { projects } from '@/lib/data/projects'

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get single project
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params
  const project = projects.find(p => p.id === parseInt(id))

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(project)
}

// PUT /api/projects/[id] - Update project (Admin only)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await request.json()
    const projectIndex = projects.findIndex(p => p.id === parseInt(id))

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...body,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }

    projects[projectIndex] = updatedProject

    return NextResponse.json(updatedProject)
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (Admin only)
export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params
  const projectIndex = projects.findIndex(p => p.id === parseInt(id))

  if (projectIndex === -1) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  projects.splice(projectIndex, 1)

  return NextResponse.json(
    { message: 'Project deleted successfully' },
    { status: 200 }
  )
}