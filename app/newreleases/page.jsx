'use client'
import SongCard from './components/SongCard'
import { useGetTopChartsQuery } from '../redux/services/jioSavaanapi'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { useState } from 'react'

const NewReleases = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [language, setLanguage] = useState('hindi')
  const { data, isFetching, error } = useGetTopChartsQuery({
    language,
  })
  const filterData = data?.data.albums.filter((e) => e.type === 'album')
  const handleSelectChange = (e) => {
    setLanguage(e.target.value)
  }
  return (
    <div className=" flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">New Songs</h2>
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
        {filterData?.map((song, i) => (
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
  )
}

export default NewReleases
