'use server'
//login/action.ts
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginPE(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("error",error)
    throw new Error(error.message || 'Invalid email or password')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          display_name: formData.get('name') as string,
        }
      }
    }
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("signup error", error)
    throw new Error(error.message || 'Error creating account')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient() 
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline', 
        prompt: 'consent',
      },
    },
  })
  
  //console.log(data)
  if (error) {
    console.error('Error signing in with Google:', error)
    redirect('/error')
  }
  if (data.url){
    redirect(data.url)
  }
  return data
}

export async function signInWithGithub() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
     redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,

     queryParams:{
      scope: 'user:email'
     }
    },
  })
  //console.log("data", data)
  if (error) {
    console.log('Error signing in with Github:', error)
    redirect('/error')
  }
  redirect(data.url)
  return data
}