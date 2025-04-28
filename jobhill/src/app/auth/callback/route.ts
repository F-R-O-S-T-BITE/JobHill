import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/private'

  if (code) {
    const supabase = await createClient()
    
    try {
      // Intercambiamos el código por la sesión y manejamos adecuadamente los tokens
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }
      
      // Si tenemos datos de la sesión y no hay error, procedemos con la redirección
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // Desarrollo local
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Entorno con load balancer
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Entorno de producción estándar
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (e) {
      console.error("Exception in auth callback:", e)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  // No hay código en los parámetros, redireccionar a página de error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}