import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Check if accessing admin routes (but not login-related routes)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login') && 
      !request.nextUrl.pathname.startsWith('/admin/forgot-password')) {
    
    const adminSession = request.cookies.get('admin-session')
    console.log('Admin session cookie:', adminSession?.value)
    
    // If no session or session is not authenticated, redirect to login
    if (!adminSession || adminSession.value !== 'authenticated') {
      console.log('Redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If accessing admin login while already authenticated, redirect to admin dashboard
  if (request.nextUrl.pathname === '/admin/login') {
    const adminSession = request.cookies.get('admin-session')
    
    if (adminSession && adminSession.value === 'authenticated') {
      console.log('Already authenticated, redirecting to admin')
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}