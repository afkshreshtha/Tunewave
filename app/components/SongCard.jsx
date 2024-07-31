import React from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import PlayPause from './PlayPause'
import { playPause, setActiveSong } from '../redux/Features/playerSlice'
import Image from 'next/image'

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handlePauseClick = () => {
    dispatch(playPause(false))
  }

  const handlePlayClick = () => {
 
    dispatch(setActiveSong({ song, data, i }))
    dispatch(playPause(true))
    router.push(`/${'playlist'}/${song.id}/${song.songCount}`)
    localStorage.setItem('click',true)
  }

  const decodeHTMLString = (str) => {
    return str?.replace(/&quot;/g, '"')
  }

  let str = song.name || song.title
  str = decodeHTMLString(str)

  const handlePlayMusic = () => {
    router.push(`/${'playlist'}/${song.id}/${song.songCount}`)

  }

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-50 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.id === song.id ? 'flex bg-black bg-opacity-70' : 'hidden'
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
          src={song.image[2]?.url}
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="mt-4 flex flex-col">
        <p
          className="font-semibold text-lg text-white truncate"
          onClick={handlePlayMusic}
        >
          {str}
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          {song?.artists?.all.map((e) => e?.name) || song.subtitle}
        </p>
      </div>
    </div>
  )
}

export default SongCard
