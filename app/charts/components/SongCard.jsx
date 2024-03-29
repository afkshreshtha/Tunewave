import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import PlayPause from '../../components/PlayPause'
import { playPause, setActiveSong } from '../../redux/Features/playerSlice'
import Image from 'next/image'

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch()

  const handlePauseClick = () => {
    dispatch(playPause(false))
  }

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }))
    dispatch(playPause(true))
  }

  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }

  let str = song.name || song.title
  str = decodeHTMLString(str)
  const router = useRouter()
  const handlePlayMusic = () => {
    router.push(`${'playlist'}/${song.id}`),
      localStorage.setItem('playMusic', 0)
  }
  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.id === song.id
              ? 'flex bg-black bg-opacity-70'
              : 'hidden'
          }`}
          onClick={handlePlayMusic}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <Image
          unoptimized={true}
          width={1000}
          height={1000}
          alt="song_img"
          src={song.image[2]?.link}
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate" onClick={() => router.push(`${'playlist'}/${song.id}`)}>{str}</p>
        <p className="text-sm truncate text-gray-300 mt-1">{song.subtitle}</p>
      </div>
    </div>
  )
}

export default SongCard
