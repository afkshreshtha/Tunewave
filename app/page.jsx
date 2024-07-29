'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import SongCard from './components/SongCard'
import usePlaylist from './hooks/usePlaylist'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { supabase } from './utils/supabase.js'
import Dropdown from './components/Dropdown' // Import the Dropdown component

const Discover = () => {
  const [page, setPage] = useState(1)
  const [selectedQuery, setSelectedQuery] = useState('Pop') // State for selected query
  const { songs, hasMore, loading, error } = usePlaylist(selectedQuery, page)
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

  useEffect(() => {
    const getUserData = async () => {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user)
        }
      })
    }
    getUserData()
  }, [])

  const handleOptionSelect = (option) => {
    setSelectedQuery(option)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4">
          <h2 className="font-bold text-3xl text-white text-left mb-10">
            Discover
          </h2>
          <Dropdown
            options={[
              'English',
              'Pop',
              'Rock',
              'Hip Hop',
              'Jazz',
              'Soul',
              'Sleep',
              'Ambient',
              'Devotional',
              'Folk',
              'Party',
              'Punk',
              'Metal',
              'Indie',
              'Edm',
              'Melody',
              'Focus',
              'Instrumental',
            ]} // Options for the dropdown
            selectedOption={selectedQuery}
            onOptionSelect={handleOptionSelect}
          />
        </div>

        {loading && <ClipLoader color="#fff" />}
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
                    data={song}
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
                  data={song}
                  i={index}
                />
              )
            }
          })}
        </div>
      </div>
    </>
  )
}

export default Discover
