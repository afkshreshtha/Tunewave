import { useDispatch, useSelector } from 'react-redux'
import {
  playPause,
  setActiveSong,
  stopSong,
} from '../../../redux/Features/playerSlice'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../../utils/supabase'
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai'
import gif from '../../../../public/music.gif'
import PlayPause from '../../../components/PlayPause'

const TrendingSongsDetails = ({ song, i, data }) => {
  const dispatch = useDispatch()
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [isLikedSong, setIsLikedSong] = useState(false)
  const [click, setClick] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const decodeHTMLString = (str) => str?.replace(/&quot;/g, '"')
  const str = decodeHTMLString(song?.name)
  const downloadURL = song.downloadUrl[4]?.url

  const uploadSong = async (song) => {
    const user = await supabase.auth.getUser()
    const formattedSongs = {
      songid: song.id,
      user_id: user.data.user.id,
    }
    await supabase.from('likedsongs').upsert(formattedSongs)
  }

  const handleLikeClick = async () => {
    const user = await supabase.auth.getUser()
    if (!user) {
      alert('Please login to like this song')
      return
    }
    if (isLikedSong) {
      await supabase
        .from('likedsongs')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('songid', song.id)
    } else {
      await uploadSong(song)
    }
    setIsLikedSong(!isLikedSong)
  }

  const handleDownload = async () => {
    const response = await fetch(downloadURL)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${str}`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('likedsongs')
          .select('songid')
          .eq('user_id', user.data.user.id)
        if (error) throw error
        setIsLikedSong(data.some((item) => item.songid === song.id))
      } catch (error) {
        console.error('Error fetching liked songs:', error.message)
      }
    }
    fetchLikedSongs()
  }, [song.id])

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      setIsUserLoggedIn(session?.data.session !== null)
    }
    fetchSession()
  }, [])

  const handlePauseClick = () => {
    dispatch(playPause(false))
  }

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }))
    dispatch(playPause(true))
  }
  const handleButtonClick = () => {
    setClick((prevState) => !prevState)
    if (!click) {
      dispatch(setActiveSong({ song, data, i }))
      dispatch(playPause(true))
    } else {
      dispatch(playPause(false))
    }
  }
  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg">
        {/* Image Section */}
        <div className="relative w-full h-48 group" onClick={handleButtonClick}>
          <Image
            unoptimized={true}
            src={
              activeSong?.id === song.id && isPlaying ? gif : song.image[2].url
            }
            alt="img"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
          <div
            className={`absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer ${
              (activeSong?.id === song.id && isPlaying) ||
              'group-hover:flex hidden'
            } ${
              activeSong?.id === song.id && isPlaying
                ? ' bg-opacity-50'
                : 'bg-black bg-opacity-50'
            }`}
          >
            {/* <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
            /> */}
          </div>
        </div>

        {/* Text Section */}
        <div className="p-4">
          <h2 className="text-xl font-bold">{str}</h2>
          <div className="text-gray-400 mt-2">
            by {song.artists.primary[0].name}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-4">
            {isUserLoggedIn && (
              <div
                className="text-white cursor-pointer"
                onClick={handleLikeClick}
              >
                {isLikedSong ? (
                  <AiFillHeart size={24} />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
              </div>
            )}
            <div className="text-white cursor-pointer" onClick={handleDownload}>
              <AiOutlineDownload size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingSongsDetails
