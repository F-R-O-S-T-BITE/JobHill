'use server'
//login/action.ts
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
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
  console.log("data", data)

  if (error) {
    console.log('Error signing in with Github:', error)
    redirect('/error')
  }

  redirect(data.url)

  
  return data
}