'use client'

import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useGetTopSongsDetailsQuery } from '../../redux/services/jioSavaanapi'
import ArtistDetail from './components/artistDetail'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import PlayPause from '../../components/PlayPause'
import { playPause, setActiveSong } from '../../redux/Features/playerSlice'

const SongDetails = () => {
  const { songId } = useParams()
  const [click, setClick] = useState(false)
  const { data, isFetching } = useGetTopSongsDetailsQuery({
    songid: songId,
  })
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  let str = data?.data?.name
  str = decodeHTMLString(str)
  const song = data?.data?.[0]
  const dispatch = useDispatch()
  const handlePauseClick = () => {
    dispatch(playPause(false))
  }

  const handlePlayClick = () => {
    dispatch(setActiveSong({ data, song, songId }))
    dispatch(playPause(true))
  }
  return (
    <div className="p-4 md:p-8 lg:p-12 overflow-hidden">
      <div className="flex flex-col md:flex-row bg-[#bbbbb4] justify-center md:justify-start relative overflow-hidden">
        <div className="flex justify-center md:justify-start">
          <Image
            src={data?.data?.[0]?.image?.[2]?.url}
            alt="img"
            width={180}
            height={180}
            className="mt-5 md:ml-5"
          />
        </div>
        <div className="mt-5 md:mt-0 md:ml-5">
          <h1 className="text-white text-center md:text-left font-medium text-[1.6rem]">
            {str}
          </h1>
          <div className="flex flex-col justify-center mt-3">
            <span className="text-white text-2xl md:text-3xl font-bold">
              Name: {data?.data[0]?.name}
            </span>
            <span className="text-white mt-2">
              Released in: {data?.data[0]?.releaseDate}
            </span>
            <div className="mt-5 mb-5 ml-0 md:ml-5 cursor-pointer">
              <PlayPause
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePause={handlePauseClick}
                handlePlay={handlePlayClick}
                song={song}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-white text-2xl font-bold text-center mt-5">
          Artists
        </h3>
        <ArtistDetail data={data?.data[0]?.artists?.all} />
      </div>
    </div>
  )
}

export default SongDetails