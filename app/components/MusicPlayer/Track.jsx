'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Track = ({ isPlaying, isActive, activeSong }) => {
  const router = useRouter()
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }
  let str = activeSong?.name || activeSong?.title
  str = decodeHTMLString(str)

  return (
    <div className="flex-1 flex items-center justify-start">
      <div
        className={`${
          isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''
        } hidden sm:block h-16 w-16 mr-4`}
      >
        <Image
          src={activeSong?.image[2]?.url}
          width={60}
          height={60}
          alt="cover art"
          className="rounded-full"
        />
      </div>
      <div className="w-[50%] " >
        <p className="truncate text-white font-bold cursor-pointer text-lg"onClick={()=>router.push(`/song/${activeSong.id}`)}>
          {str ? str : 'No active Song'}
        </p>
        <p className="truncate cursor-pointer text-gray-300"onClick={()=>router.push(`/song/${activeSong.id}`)}>
          {activeSong?.subtitle || activeSong?.year
            ? activeSong?.subtitle || activeSong?.year
            : 'No active Song'}
        </p>
      </div>
    </div>
  )
}

export default Track
