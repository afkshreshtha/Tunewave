'use client'
import { useDispatch } from 'react-redux'
import {
  playPause,
  setActiveSong,
} from '../../../../redux/Features/playerSlice'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../../../utils/supabase'
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai'
import gif from '../../../../../public/music.gif'
import { toast } from 'react-toastify'
import axios from 'axios'

const TrendingSongsDetails = ({ song, i, isPlaying, activeSong, data }) => {
  const dispatch = useDispatch()
  const [likedSongsId, setLikedSongsId] = useState([])
  const [isLikedSong, setIsLikedSong] = useState(false)
  const [click, setClick] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  
  const handleButtonClick = () => {
    setClick(true)
    if (click) {
      dispatch(setActiveSong({ song, data, i }))
      dispatch(playPause(true))
    } else {
      dispatch(playPause(false))
    }
  }
  useEffect(() => {
    setClick(false)
  }, [activeSong])

  const decodeHTMLString = (str) => {
    return str?.replace(/&quot;/g, '"')
  }

  let str = decodeHTMLString(song?.name)

  const uploadSong = async (song) => {
    const user = await supabase.auth.getUser()
    const formattedSong = {
      songid: song.id,
      user_id: user.data.user.id,
    }
    await supabase.from('likedsongs').upsert(formattedSong)
  }

  const handleClick = () => {
    uploadSong(song)
    setIsLikedSong(true)
  }

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('likedsongs')
          .select('songid')
          .eq('user_id', user.data.user.id)

        if (error) {
          console.error('Error fetching liked songs:', error.message)
        } else {
          setLikedSongsId(data.map((item) => item.songid))
        }
      } catch (error) {
        console.error('Error:', error.message)
      }
    }
    fetchLikedSongs()
  }, [])

  const handleLikeClick = async (songId) => {
    const user = await supabase.auth.getUser()
    try {
      const { data, error } = await supabase
        .from('likedsongs')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('songid', songId)

      if (error) {
        console.error('Error deleting liked song:', error.message)
      } else {
        setLikedSongsId((prev) => prev.filter((id) => id !== songId))
      }
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  const handleDownload = async () => {
    const artists = song.artists.primary.map((e) => e.name)
    const album = song.album.name
    const filename = `${str}` // Use a timestamp or unique identifier for filename

    const downloadPromise = async () => {
      const downloadURL = song.downloadUrl[4]?.url
      const coverImageUrl = song.image[2]?.url

      const response = await axios.post(
        'https://audio-changer.onrender.com/convert',
        {
          audioUrl: downloadURL,
          imageUrl: coverImageUrl,
          artists: artists,
          album: album,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Ensure this matches the response from the server
        },
      )
      console.log(response.data)
      if (response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'audio/mpeg' }),
        )
        console.log(url)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url) // Clean up the URL object
        return 'Download complete!'
      } else {
        throw new Error('Error in API response: ' + response.data.error)
      }
    }

    toast.promise(
      downloadPromise(),
      {
        pending: 'Download in progress...',
        success: 'Download complete!',
        error: {
          render({ data }) {
            return `Error during download: ${data.message}`
          },
        },
      },
      {
        position: 'top-right',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setIsUserLoggedIn(!!data?.session)
    }
    fetchSession()
  }, [])

  return (
    <div className="mt-10 mb-10 flex items-center justify-between mr-4">
      <div className="flex items-center">
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

      <div className="flex items-center">
        {isUserLoggedIn && (
          <div className="text-white mr-2 cursor-pointer">
            {isLikedSong || likedSongsId.includes(song.id) ? (
              <AiFillHeart onClick={() => handleLikeClick(song.id)} />
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
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingSongsDetails
