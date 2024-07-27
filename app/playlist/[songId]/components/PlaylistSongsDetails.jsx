'use client'
import { useDispatch } from 'react-redux'
import { playPause, setActiveSong } from '../../../redux/Features/playerSlice'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../../utils/supabase'
import gif from "../../../../public/music.gif"
import { AiFillHeart, AiOutlineDownload, AiOutlineHeart } from 'react-icons/ai'
const PlaylistSongsDetails = ({ song, i, isPlaying, activeSong, data }) => {
  const dispatch = useDispatch()
  const [LikedSongsid, setLikedSongsid] = useState([])
  const [IslikedSong, setIsLikedSong] = useState(false)
  const [click, setClick] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  const handleButtonClick = () => {
    setClick((prevState) => !prevState) // Toggle the value of 'click'
    if (click === false) {
      dispatch(playPause(false))
    } else {
      dispatch(setActiveSong({ song, data, i }))
      dispatch(playPause(true))
    }
  }
  if (localStorage.getItem('playMusic', 0)) {
    dispatch(setActiveSong({ song, data, i }))
    dispatch(playPause(true))
    localStorage.removeItem('playMusic')
  }
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }

  let str = song?.name
  str = decodeHTMLString(str)
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

        setIsFetching(false)
      } catch (error) {
        console.error('Error:', error.message)
        setIsFetching(false)
      }
    }

    fetchLikedSongs()
  }, [isFetching])
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

  const l = LikedSongsid?.map((song) => song?.songid)
  const a = l?.includes(song?.id)
  const downloadURL = song.downloadUrl[4].link
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
  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [])

  return (
    <div class="mt-10 mb-10 flex items-center justify-between mr-4">
      <div class="flex items-center">
        <div
          onClick={handleButtonClick}
          className={`cursor-pointer mr-4 ${
            activeSong?.id === song.id && isPlaying
              ? 'text-green-400'
              : 'text-white'
          }`}
        >
          {str}
        </div>
        <div className="flex flex-wrap">{song.primaryArtists}</div>
      </div>
      <div class="flex items-center">
        {!isUserLoggedIn && (
          <div className="text-white mr-4">
            {IslikedSong || a ? (
              <AiFillHeart onClick={handleLikeSong} />
            ) : (
              <AiOutlineHeart onClick={handleClick} />
            )}
          </div>
        )}
        <div
          className="text-white mr-[10px] cursor-pointer"
          onClick={handleDownload}
        >
          <AiOutlineDownload size={20} />
        </div>
        <div onClick={handleButtonClick} className="cursor-pointer">
        <div className="w-16 h-16 md:w-20 md:h-20">
            <Image
              unoptimized={true}
              src={
                activeSong?.id === song.id && isPlaying === true
                  ? gif
                  : song.image[2].url
              }
              alt="img"
              width={50}
              height={50}
              objectFit="contain" // Adjust this based on your design needs
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default PlaylistSongsDetails
