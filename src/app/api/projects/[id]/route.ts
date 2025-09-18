import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/storage/hybridStorage'

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get single project
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params
  const project = await getProjectById(parseInt(id))

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

    console.log('API PUT request - ID:', id, 'Body:', body)

    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      console.error('Invalid project ID:', id)
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const updatedProject = await updateProject(projectId, body)

    if (!updatedProject) {
      console.error('Project not found for ID:', projectId)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log('Project updated successfully:', updatedProject.id)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to update project: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (Admin only)
export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params
  const success = await deleteProject(parseInt(id))

  if (!success) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { message: 'Project deleted successfully' },
    { status: 200 }
  )
}