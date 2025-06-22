//auth/callback/route.ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Handle OAuth callback (Google, GitHub)
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/opportunities`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/opportunities`)
      } else {
        return NextResponse.redirect(`${origin}/opportunities`)
      }
    }
  }

  if (token_hash && type) {
    // Handle email verification or password reset
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      if (type === 'recovery') {
        // Password reset - redirect to reset password page
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      } else {
        // Email confirmation - redirect to confirmed page
        return NextResponse.redirect(`${origin}/confirmed`)
      }
    }
  }

  // redirect the user to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}