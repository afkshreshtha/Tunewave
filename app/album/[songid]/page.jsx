'use client'

import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useGetNewReleasesDetailsQuery } from '../../redux/services/jioSavaanapi'
import TrendingSongsDetails from './components/TrendingSongsDetails'
import Image from 'next/image'

const SongDetails = () => {



  const { songid } = useParams()

  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const { data, isFetching, error } = useGetNewReleasesDetailsQuery({
    songid,
  })
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }
  let str = data?.data?.name
  str = decodeHTMLString(str)

  return (
    <div className="">
      <div className=" flex bg-[#bbbbb4] justify-center md:justify-start relative ">
        <Image
          src={data?.data.image?.[2].url}
          alt="img"
          width={180}
          height={180}
          className="mt-5 ml-5"
        />
      </div>
      <div className="bg-[#bbbbb4] md:absolute top-20 truncate left-[490px]">
        <h1 className="text-white text-center font-medium text-[1.6rem]">
          {str}
        </h1>
        <div className="flex flex-wrap justify-center">
        </div>
      </div>
      <div className="">
        {data?.data.songs.map((song, i) => (
          <TrendingSongsDetails
            key={song.id}
            song={song}
            i={i}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data?.data.songs}
            id={songid}
          />
        ))}
      </div>
    </div>
  )
}

export default SongDetails
