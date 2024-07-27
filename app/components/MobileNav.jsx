'use client'
import { AiOutlineHome } from 'react-icons/ai'
import { MdNewReleases } from 'react-icons/md'
import { BsMusicNoteList } from 'react-icons/bs'
import { BiLineChart } from 'react-icons/bi'
import { AiFillHeart } from 'react-icons/ai'
import { FiLogOut } from 'react-icons/fi'
import { TbLogin } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
const MobileNav = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [])
  
  const handleLogout = async () => {
    const session = await supabase.auth.getSession()
    if (session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.log('Logout error:', error.message)
      } else {
        setIsUserLoggedIn(false)
        window.location.reload()
      }
    } else {
      console.log('User is not logged in.')
    }
  }
  return (
    <div className="text-white flex  justify-evenly bg-black ">
      <div onClick={() => router.push('/')} className="cursor-pointer">
        <AiOutlineHome size={30} />
      </div>

      <div
        onClick={() => router.push('/likedsongs')}
        className="cursor-pointer"
      >
        <AiFillHeart size={30} />
      </div>
      {isUserLoggedIn ? (
        <div
          onClick={() => router.push('/sign-in')}
          className="cursor-pointer"
        >
          <TbLogin size={30} />
        </div>
      ) : (
        <div
          onClick={() => router.push('/likedsongs')}
          className="cursor-pointer"
        >
          <FiLogOut size={30} onClick={handleLogout} />
        </div>
      )}
    </div>
  )
}

export default MobileNav
