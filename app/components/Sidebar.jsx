'use client'
import React, { useEffect, useState } from 'react'
import { MdNewReleases } from 'react-icons/md'
import { BiLineChart } from 'react-icons/bi'
import { AiOutlineHeart, AiOutlineHome } from 'react-icons/ai'
import { TbPlaylist } from 'react-icons/tb'
import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logo from '../../public/logo.png'
const NavLinks = ({ handleClick }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [])

  const links = [
    { name: 'Home', to: '/', icon: <AiOutlineHome size={20} /> },
    {
      name: 'LikedSongs',
      to: '/likedsongs',
      icon: <AiOutlineHeart size={20} />, // Example icon, replace with the correct one
    },
  ]

  return (
    <>
    <div className="mt-10">
      {links.map((item, i) => (
        <div key={i} className=''>
          <Link
            href={item.to}
            className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400"
            onClick={() => handleClick && handleClick()}
          >
            <span className=" h-6 mr-2 ">{item.icon}</span>
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  </>
  )
}

const Sidebar = () => {
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
    <div className="md:flex hidden h-full flex-col w-[240px] py-10 px-4 bg-[#191624]">
      <Image src={logo} alt="Logo" quality={95} className="w-40 h-30" />
      <NavLinks />
      {isUserLoggedIn ? (
        <button
          onClick={() => router.push('/sign-in')}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          SignIn
        </button>
      ) : (
        <button
          onClick={() => handleLogout()}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Sidebar
