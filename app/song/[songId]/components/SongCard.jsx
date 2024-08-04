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
import axios from 'axios'
import { toast } from 'react-toastify';

const TrendingSongsDetails = ({ song, i, data }) => {
  const dispatch = useDispatch()
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [isLikedSong, setIsLikedSong] = useState(false)
  const [click, setClick] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const decodeHTMLString = (str) => str?.replace(/&quot;/g, '"')
  const str = decodeHTMLString(song?.name)
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
    const artists = song.artists.primary.map((e) => e.name);
    const album = song.album.name;
    const filename = `${str}`; // Use a timestamp or unique identifier for filename

    const downloadPromise = async () => {
      const downloadURL = song.downloadUrl[4]?.url;
      const coverImageUrl = song.image[2]?.url;

      const response = await axios.post('https://audio-changer.onrender.com/convert', {
        audioUrl: downloadURL,
        imageUrl: coverImageUrl,
        artists: artists,
        album: album,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Ensure this matches the response from the server
      });

      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the URL object
        return 'Download complete!';
      } else {
        throw new Error('Error in API response: ' + response.data.error);
      }
    };

    toast.promise(
      downloadPromise(),
      {
        pending: 'Download in progress...',
        success: 'Download complete!',
        error: {
          render({ data }) {
            return `Error during download: ${data.message}`;
          }
        }
      },
      {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };
  
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

  const handleButtonClick = () => {
    setClick(true)
    if (click) {
      dispatch(setActiveSong({ song, data, i }))
      dispatch(playPause(true))
       setClick(false)
    } else {
      dispatch(playPause(false))
     
    }
  }
  return (
    <div className="p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg">
        {/* Image Section */}
        <div className="relative w-full h-48 group" onClick={handleButtonClick} >
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
            <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
            />
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
