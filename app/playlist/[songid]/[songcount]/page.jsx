'use client'

import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import {
  useGetSongsDetailsQuery,
} from '../../../redux/services/jioSavaanapi'
import TrendingSongsDetails from './components/TrendingSongsDetails'
import Image from 'next/image'
import useSongDetail from '../../../hooks/useSongDetail'
import { useCallback, useRef, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SongDetails = () => {
  const { songid, songcount } = useParams()

  const [page, setPage] = useState(1)
  const { songs, hasMore, loading, error } = useSongDetail(songid, page)
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const { data, isFetching } = useGetSongsDetailsQuery({
    songid,
  })
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }
  let str = data?.data?.name
  str = decodeHTMLString(str)

  const observer = useRef()
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
  
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const scrollPosition = window.scrollY;  // Capture scroll position
  
          setPage((prevPage) => prevPage + 1);
  
          // Restore scroll position after state update
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 0);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  if (isFetching) {
    return (
      <div className="p-5">
        <SkeletonTheme baseColor='#343333'>
              <Skeleton circle={true} height={180} width={180} />
        <Skeleton count={2} />
        <Skeleton count={5} />
        <Skeleton count={5} />  
        </SkeletonTheme>
  
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex bg-[#bbbbb4] justify-center md:justify-start relative">
        {data?.data.image?.[2]?.url ? (
          <Image
            src={data.data.image[2].url}
            alt="img"
            width={180}
            height={180}
            className="mt-5 ml-5"
          />
        ) : (
          <Skeleton circle={true} height={180} width={180} />
        )}
      </div>
      <div className="bg-[#bbbbb4] md:absolute top-20 truncate left-[490px]">
        <h1 className="text-white text-center font-medium text-[1.6rem]">
          {str ? str : <Skeleton width={200} />}
        </h1>
        <div className="flex flex-wrap justify-center">
          <span className="text-white">by</span>
          {data?.data?.artists.slice(0, 5).length > 0 ? (
            data.data.artists.slice(0, 5).map((artist, index) => (
              <span key={index} className="text-white ml-2">
                {artist.name}
                {index < 4 && ', '}
              </span>
            ))
          ) : (
            <Skeleton count={5} width={100} />
          )}
        </div>
        <div>
          <p className="text-white text-2xl font-bold">
            {songcount ? `${songcount} songs` : <Skeleton width={100} />}
          </p>
        </div>
      </div>
      <div className="" ref={lastBookElementRef}>
        {songs.length === 0 && !loading ? (
          <Skeleton count={5} height={100} />
        ) : (
          songs.map((song, index) => {
            if (songs.length === index + 1) {
              return (
                <div key={song.id} ref={lastBookElementRef}>
                  <TrendingSongsDetails
                    key={song.id}
                    song={song}
                    isPlaying={isPlaying}
                    activeSong={activeSong}
                    data={songs}
                    i={index}
                  />
                </div>
              )
            } else {
              return (
                <TrendingSongsDetails
                  key={song.id}
                  song={song}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={songs}
                  i={index}
                />
              )
            }
          })
        )}
      </div>
    </div>
  )
}

export default SongDetails
