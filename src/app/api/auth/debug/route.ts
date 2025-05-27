import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { headers } from 'next/headers'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Get the raw JWT token from the request cookies
    const cookies = Object.fromEntries(
      (headers().get('cookie') || '').split('; ').map(c => c.split('='))
    )
    
    const token = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token']
    
    return NextResponse.json({
      session: session ? {
        user: session.user ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role
        } : 'No user in session',
        expires: session.expires
      } : 'No session',
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPrefix: token ? `${token.substring(0, 10)}...` : 'No token',
      cookies: Object.keys(cookies),
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
