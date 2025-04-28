import { type NextRequest } from 'next/server'
import { updateSession } from './src/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    '/login',
    '/register',
    '/',
    '/auth/callback',
    '/auth/auth-code-error',
    '/error',
    '/api/public'
  ]

  // Verificar si es una ruta pública o estática/imagen
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isStaticFile = pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico)$/)
  const isApiRoute = pathname.startsWith('/api/')
  const isNextRoute = pathname.startsWith('/_next/')

  // Si es una ruta pública o un archivo estático, no requerimos autenticación
  if (isPublicRoute || isStaticFile || isApiRoute || isNextRoute) {
    return await updateSession(request)
  }

  // Para todas las demás rutas, aplicamos verificación de sesión completa
  return await updateSession(request)
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
   '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

