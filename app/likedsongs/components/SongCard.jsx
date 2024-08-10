import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import PlayPause from '../../components/PlayPause'
import { playPause, setActiveSong } from '../../redux/Features/playerSlice'
import Image from 'next/image'
import { AiFillHeart, AiOutlineDownload, AiOutlineHeart } from 'react-icons/ai'
import { supabase } from '../../utils/supabase'
import axios from 'axios'
import { toast } from 'react-toastify'

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [isLikedSong, setIsLikedSong] = useState(false)
  const [likedSongsId, setLikedSongsId] = useState([])
  const [click, setClick] = useState(false)
  const handleButtonClick = () => {
    setClick((prevState) => !prevState)
    if (!click) {
      dispatch(setActiveSong({ song, data, i }))
      dispatch(playPause(true))
    } else {
      dispatch(playPause(false))
    }
  }

  const decodeHTMLString = (str) => str?.replace(/&quot;/g, '"')

  let str = song.name || song.title
  str = decodeHTMLString(str)
  const router = useRouter()
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
          setLikedSongsId(data)
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
        setLikedSongsId(data)
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
      setIsUserLoggedIn(session?.data.session !== null)
    }
    fetchSession()
  }, [isLikedSong])

  const likedSongIds = likedSongsId?.map((song) => song?.songid)
  const isSongLiked = likedSongIds?.includes(song?.id)

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.id === song.id
              ? 'flex bg-black bg-opacity-70'
              : 'hidden'
          }`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handleButtonClick}
            handlePlay={handleButtonClick}
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
        <p className="font-semibold text-lg text-white truncate">
          {song.subtitle}
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="text-white cursor-pointer" onClick={handleDownload}>
            <AiOutlineDownload size={20} />
          </div>
          {isUserLoggedIn && (
            <div
              className="text-white cursor-pointer"
              onClick={isSongLiked ? handleLikeSong : handleClick}
            >
              {isSongLiked || isLikedSong ? (
                <AiFillHeart size={20} />
              ) : (
                <AiOutlineHeart size={20} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SongCard
