"use client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../utils/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Reload the page when the user signs in
        window.location.reload();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()     
      if(session.data.session){
        setIsUserLoggedIn(true)
      } 
    }
    fetchSession()
  },[])

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push('/')
    } else {
      router.push('/sign-in')
    }
  }, [isUserLoggedIn, router])

  return (
    <div className="">
      <Auth  
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          className:{
            message:'#fff'
          },
          style:{
            message: { color: 'white' },
          }
        }}
        theme="dark"
        providers={['discord', 'google']}
      />
    </div>
  )
}

export default Login
