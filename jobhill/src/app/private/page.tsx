'use client'
//register/page.tsx

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Private() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0353A4]">Perfil de Usuario</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Datos del Usuario:</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">ID:</p>
                <p className="text-gray-800">{user.id}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email:</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Proveedor de Autenticación:</p>
                <p className="text-gray-800">{user.app_metadata?.provider || 'Email/Password'}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email verificado:</p>
                <p className="text-gray-800">{user.email_confirmed_at ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Último inicio de sesión:</p>
                <p className="text-gray-800">{new Date(user.last_sign_in_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Creado el:</p>
                <p className="text-gray-800">{new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {user.identities && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Identidades Vinculadas:</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-4">
                {user.identities.map((identity: any) => (
                  <li key={identity.id} className="p-4 bg-white rounded-md shadow-sm">
                    <p className="font-medium text-[#0353A4]">
                      {identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">ID: {identity.identity_data?.sub}</p>
                    {identity.identity_data?.email && (
                      <p className="text-sm text-gray-600">Email: {identity.identity_data.email}</p>
                    )}
                    {identity.identity_data?.name && (
                      <p className="text-sm text-gray-600">Nombre: {identity.identity_data.name}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-[#0353A4] hover:underline font-medium"
          >
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  )
}