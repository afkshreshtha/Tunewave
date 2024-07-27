'use client'

import { useEffect, useState } from 'react'
import SongCard from './components/SongCard'
import { useGetTopChartsQuery } from './redux/services/jioSavaanapi'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { supabase } from './utils/supabase.js'
import Dropdown from './components/Dropdown' // Import the Dropdown component

const Discover = () => {
  const [isClient, setIsClient] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState('Pop') // State for selected query

  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const { data, isFetching, error } = useGetTopChartsQuery({
    query: selectedQuery, // Use the selected query
  })

  const [user, setUser] = useState({})

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <div className="flex flex-col items-center">
        {isClient && (
          <div>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8166123895280023"
              crossOrigin="anonymous"
            ></script>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-8166123895280023"
              data-ad-slot="5552238212"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        )}

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
            onOptionSelect={setSelectedQuery}
          />
        </div>

        {isFetching && <ClipLoader color="#fff" />}
        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {data?.data.results.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data?.data.results}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Discover
