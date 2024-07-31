'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../utils/supabase.js'
import SongCard from '../../components/SongCard.jsx'
import usePlaylist from '../../hooks/usePlaylist.jsx'
import { useParams } from 'next/navigation'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Discover = () => {
  const { genere } = useParams()
  const [page, setPage] = useState(1)
  const { songs, hasMore, loading, error } = usePlaylist(genere, page)
  const { activeSong, isPlaying } = useSelector((state) => state.player)

  const observer = useRef()
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4">
          <h2 className="font-bold text-3xl text-white text-left mb-10">
            Discover {genere} songs
          </h2>
        </div>

        {loading && (
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            {[...Array(8)].map((_, index) => (
              <SkeletonTheme key={index} baseColor='#343333'>
                <div className="w-48">
                  <Skeleton height={192} />
                  <Skeleton count={1} />
                </div>
              </SkeletonTheme>
            ))}
          </div>
        )}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            {songs.map((song, index) => {
              if (songs.length === index + 1) {
                return (
                  <div key={song.id} ref={lastBookElementRef}>
                    <SongCard
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
                  <SongCard
                    key={song.id}
                    song={song}
                    isPlaying={isPlaying}
                    activeSong={activeSong}
                    data={songs}
                    i={index}
                  />
                )
              }
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Discover
