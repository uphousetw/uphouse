import { NextRequest, NextResponse } from 'next/server'

// Simple admin credentials - in production, these should be stored securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'uphouse2024',
  email: 'admin@uphouse.com'
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, rememberMe } = await request.json()

    // Validate credentials
    const isValidUsername = username === ADMIN_CREDENTIALS.username || username === ADMIN_CREDENTIALS.email
    const isValidPassword = password === ADMIN_CREDENTIALS.password

    if (!isValidUsername || !isValidPassword) {
      return NextResponse.json(
        { message: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }

    // Create response with session cookie
    const response = NextResponse.json(
      { message: '登入成功', user: { username: ADMIN_CREDENTIALS.username } },
      { status: 200 }
    )

    // Set session cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    response.cookies.set('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: '登入失敗，請稍後再試' },
      { status: 500 }
    )
  }
}