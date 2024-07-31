'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { supabase } from '../utils/supabase'
import SongCard from './components/SongCard'
import { useGetTopSongsDetailsQuery } from '../redux/services/jioSavaanapi'
import { useRouter } from 'next/navigation'

const LikedSongs = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [likedSongs, setLikedSongs] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession()
      if (session?.data.session === null) {
        setIsUserLoggedIn(true)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push('/sign-in')
    } else {
      router.push('/likedsongs')
    }
  }, [isUserLoggedIn, router])

  useEffect(() => {
    async function fetchLikedSongs() {
      try {
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('likedsongs')
          .select('*')
          .eq('user_id', user.data.user.id)

        if (error) {
          console.error('Error fetching liked songs:', error.message)
        } else {
          setLikedSongs(data)
        }

        setIsFetching(false)
      } catch (error) {
        console.error('Error:', error.message)
        setIsFetching(false)
      }
    }

    fetchLikedSongs()
  }, [])

  const songid = likedSongs?.map((song) => song?.songid).join(',')
  const { data, isFetching: fetching, error } = useGetTopSongsDetailsQuery({
    songid,
  })

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Liked Songs</h2>
      </div>
      {isFetching && (
        <div className="mt-5">
          <div className="text-white text-2xl">
            Fetching your liked songs...
          </div>
        </div>
      )}
      {isFetching ? (
        <div className="flex flex-wrap sm:justify-start justify-center gap-8 mb-20 mt-5">
          {[...Array(6)].map((_, index) => (
            <SkeletonTheme key={index} baseColor="#343333">
              <div
                key={index}
                className="w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg"
              >
                <Skeleton height={224} className="w-full h-full rounded-lg" />
                <div className="mt-4 flex flex-col">
                  <Skeleton height={20} className="mb-2" />
                  <Skeleton height={20} />
                  <div className="mt-4 flex space-x-4">
                    <Skeleton circle={true} height={20} width={20} />
                    <Skeleton circle={true} height={20} width={20} />
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          ))}
        </div>
      ) : data === undefined || data.length === 0 ? (
        <div className="text-white text-2xl">
          Please add your favorite songs
        </div>
      ) : (
        <div className="flex flex-wrap sm:justify-start justify-center gap-8 mb-20">
          {data?.data?.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data.data}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LikedSongs
