import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get('admin-session')
  const isAuthenticated = adminSession && adminSession.value === 'authenticated'
  
  return NextResponse.json({
    authenticated: isAuthenticated
  })
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Session cleared' })
  
  // Clear the session cookie
  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
  
  return response
}