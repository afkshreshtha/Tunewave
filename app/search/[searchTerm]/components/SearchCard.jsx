'use client'
import { useDispatch } from 'react-redux'
import { playPause, setActiveSong } from '../../../redux/Features/playerSlice'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../../utils/supabase'
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai'
import gif from '../../../../public/music.gif'
import { toast } from 'react-toastify'
import axios from 'axios'
const TrendingSongsDetails = ({ song, i, isPlaying, activeSong, data }) => {
  const dispatch = useDispatch()
  const [LikedSongsid, setLikedSongsid] = useState([])
  const [IslikedSong, setIsLikedSong] = useState(false)
  const [click, setClick] = useState(false)

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

  const l = LikedSongsid?.map((song) => song?.songid)
  const a = l?.includes(song?.id)

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
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [])
  return (
    <div className="mt-10 mb-10 flex items-center justify-between mr-4">
      <div className="flex items-center">
        <h2 className='text-white'>{song.length}  </h2>
        <div
          onClick={handleButtonClick}
          className={`cursor-pointer mr-4 ${
            activeSong?.id === song.id && isPlaying
              ? 'text-green-400'
              : 'text-white'
          }`}
        >
         {i+1}.{str}
          <div className="flex flex-wrap mt-2">by {song.artists.primary[0].name} ...</div>
        </div>
       
      </div>
 
      <div className="flex items-center">
        {!isUserLoggedIn && (
          <div className="text-white mr-2 cursor-pointer">
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
export default TrendingSongsDetails

