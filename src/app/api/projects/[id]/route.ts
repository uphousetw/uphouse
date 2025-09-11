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
    console.log('PUT route called')
    const { id } = await params
    console.log('Project ID:', id)
    
    // Check if request has body
    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    let body = {}
    if (contentType && contentType.includes('application/json')) {
      const bodyText = await request.text()
      console.log('Request body text:', bodyText)
      
      if (bodyText.trim()) {
        try {
          body = JSON.parse(bodyText)
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          )
        }
      }
    }
    console.log('Parsed request body:', body)
    
    const projectIndex = projects.findIndex(p => p.id === parseInt(id))
    console.log('Project index:', projectIndex)
    console.log('Available projects:', projects.map(p => ({ id: p.id, title: p.title })))

    if (projectIndex === -1) {
      console.log('Project not found')
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

    console.log('Updated project:', updatedProject)
    projects[projectIndex] = updatedProject
    console.log('Project updated successfully')

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error in PUT route:', error)
    return NextResponse.json(
      { error: 'Invalid request body', details: error instanceof Error ? error.message : 'Unknown error' },
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