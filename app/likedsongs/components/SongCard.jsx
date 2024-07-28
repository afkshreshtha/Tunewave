import React,{useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import PlayPause from '../../components/PlayPause'
import { playPause, setActiveSong } from '../../redux/Features/playerSlice'
import Image from 'next/image'
import { AiFillHeart, AiOutlineDownload, AiOutlineHeart } from 'react-icons/ai'
import { supabase } from '../../utils/supabase'

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [IslikedSong, setIsLikedSong] = useState(false)
  const [LikedSongsid, setLikedSongsid] = useState([])
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
  const downloadURL = song.downloadUrl[4].url
  const handleDownload = async () => {
    const response = await fetch(downloadURL)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${str}` // Set the desired file name
    link.click()
    URL.revokeObjectURL(url)
  }

  const uploadSong = async (song) => {
    const user = await supabase.auth.getUser()
    const formattedSongs = {
      songid: song.id,
      user_id: user.data.user.id,
    }
    await supabase.from('likedsongs').upsert(formattedSongs)
  }
  const handleClick = () => {
    uploadSong(song)
    setIsLikedSong(true)
  }
  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('likedsongs')
          .select('songid')
          .eq('user_id', user.data.user.id)

        if (error) {
          console.error('Error fetching liked songs:', error.message)
        } else {
          setLikedSongsid(data)
        }
      } catch (error) {
        console.error('Error:', error.message)
      }
    }
    fetchLikedSongs()
  }, [])
  const handleLikeClick = async (songid) => {
    const user = await supabase.auth.getUser()
    try {
      const { data, error } = await supabase
        .from('likedsongs')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('songid', songid)

      if (error) {
        console.error('Error deleting liked song:', error.message)
      } else {
        setLikedSongsid(data)
      }
    } catch (error) {
      console.error('Error:', error.message)
    }
  }
  const handleLikeSong = () => {
    handleLikeClick(song.id)
  }
  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [IslikedSong])
  const l = LikedSongsid?.map((song) => song?.songid)
  const a = l?.includes(song?.id)
  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.id === song.id
              ? 'flex bg-black bg-opacity-70'
              : 'hidden'
          }`}
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
        <p className="font-semibold text-lg text-white truncate">{str}</p>
        <p className="font-semibold text-lg text-white truncate">  { song.subtitle}</p>
        <div
          className="text-white mr-[10px] cursor-pointer"
          onClick={handleDownload}
        >
          <AiOutlineDownload size={20} />
        </div>
        {!isUserLoggedIn && (
          <div className="text-white mr-2 cursor-pointer">
            {IslikedSong || a ? (
              <AiFillHeart onClick={handleLikeSong} />
            ) : (
              <AiOutlineHeart onClick={handleClick} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SongCard
