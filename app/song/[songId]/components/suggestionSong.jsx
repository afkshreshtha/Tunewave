'use client'



import { useSelector } from 'react-redux'

import { useGetSuggestionQuery } from '../../../redux/services/jioSavaanapi'
import SongCard from '../components/SongCard.jsx'
import ClipLoader from 'react-spinners/ClipLoader'

const SuggestionSong = ({ songId }) => {
  const { data, loading, error } = useGetSuggestionQuery({ songid: songId })
  const { activeSong, isPlaying } = useSelector((state) => state.player)

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4">
          <h2 className="font-bold text-3xl text-white text-left mb-10">
            Suggestion songs
          </h2>
        </div>

        {loading && <ClipLoader color="#fff" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {data?.data.map((song, index) => {
            return (
              <div key={song.id}>
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  data={data?.data}
                  i={index}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default SuggestionSong
