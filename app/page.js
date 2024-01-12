'use client'

import { useEffect, useState } from 'react'
import SongCard from './components/SongCard'
import { useGetTopChartsQuery } from './redux/services/jioSavaanapi'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { supabase } from './utils/supabase.js'

const Discover = () => {
  const [isClient, setIsClient] = useState(false)
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [language, setLanguage] = useState('hindi')
  const { data, isFetching, error } = useGetTopChartsQuery({
    language,
  })
  const handleSelectChange = (e) => {
    setLanguage(e.target.value)
  }
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
      <div className=" flex flex-col">
        {isClient && (
          <div>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8166123895280023"
              crossorigin="anonymous"
            ></script>
            <ins
              class="adsbygoogle"
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
          <h2 className="font-bold text-3xl text-white text-left">
            Trending Now
          </h2>
          <div className="p-4">
            <select
              onChange={handleSelectChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="punjabi">Punjabi</option>
            </select>
          </div>
        </div>
        {isFetching && <ClipLoader color="#fff" />}
        <div className=" flex flex-wrap sm:justify-start justify-center gap-8 mb-20">
          {data?.data.trending.albums.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data?.data.trending.albums}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Discover
