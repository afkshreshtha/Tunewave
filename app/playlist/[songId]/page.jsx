'use client'

import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useGetSongsDetailsQuery } from '../../redux/services/jioSavaanapi'
import PlaylistSongsDetails from './components/PlaylistSongsDetails'
import Image from 'next/image'
import { AiOutlineArrowDown } from 'react-icons/ai'

const PlaylistDetails = () => {
  const { songId } = useParams()
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const { data, isFetching, error } = useGetSongsDetailsQuery({
    songid:songId
  })
  const decodeHTMLString = (str) => {
    const decodedString = str?.replace(/&quot;/g, '"')
    return decodedString
  }
  let str = data?.data?.name
  str = decodeHTMLString(str)
  console.log(data)
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "m";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num?.toString();
    }
  }
  const number = data?.data.followerCount
  const formattedNumber =formatNumber(number)
  return (
    <div className="">
      <div className=" flex bg-[#bbbbb4] justify-center md:justify-start relative ">
        <Image
          src={data?.data.image?.[2]?.url}
          alt="img"
          width={180}
          height={180}
          className="mt-5 mb-0 md:mb-5 ml-5"
        />
      </div>
      <div className="md:ml-6 xl:ml-6 bg-[#bbbbb4] md:absolute top-20 truncate left-[470px]">
        <h1 className="ml-4 text-white text-center font-medium text-[1.6rem]">
          {str}
        </h1>
        <p className="text-white text-center font-medium">
           {formattedNumber} followers
           
        </p>
        <p className="text-white text-center font-medium">
           {data?.data.songCount} songs
        </p>
      </div>
      <div className="">
        {data?.data.songs.map((song, i) => (
          <PlaylistSongsDetails
            key={song.id}
            song={song}
            i={i}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data?.data.songs}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaylistDetails
