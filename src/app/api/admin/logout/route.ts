import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: '登出成功' },
      { status: 200 }
    )

    // Clear the session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: '登出失敗' },
      { status: 500 }
    )
  }
}