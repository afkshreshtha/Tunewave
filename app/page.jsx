'use client'

import { useEffect, useState } from 'react'
import SongCard from './components/SongCard'
import { useGetTopChartsQuery } from './redux/services/jioSavaanapi'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { supabase } from './utils/supabase.js'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
const Discover = () => {
  const [isClient, setIsClient] = useState(false)
  const [click, setClick] = useState(false)
  const { activeSong, isPlaying } = useSelector((state) => state.player)
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [language,setLanguage] = useState('')
  const { data, isFetching, error } = useGetTopChartsQuery({
    language,
  })

  useEffect(() => {
    const storedLanguages = localStorage.getItem('selectedLanguages')
    if (storedLanguages === null) {
      localStorage.setItem('selectedLanguages', 'hindi')
    }
  }, [])

  const handleLanguageClick = (language) => {
    const isSelected = selectedLanguages.includes(language)
    let updatedLanguages

    if (isSelected) {
      updatedLanguages = selectedLanguages.filter((lang) => lang !== language)
    } else {
      updatedLanguages = [...selectedLanguages, language]
    }

    // Save selected languages to local storage
    localStorage.setItem(
      'selectedLanguages',
      updatedLanguages.join(',').toLowerCase(),
    )

    setSelectedLanguages(updatedLanguages)
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

   useEffect(() => {
    if (isClient) {
      // Your client-side code that uses localStorage
      const storedLanguages = localStorage.getItem('selectedLanguages');
      setLanguage(storedLanguages)
      // Rest of the client-side code...
    }
  }, [selectedLanguages,isClient]);
  
  return (
    <>
      <div className=" flex flex-col">
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
            Trending Now
          </h2>
          <div className=''>
            <section className="mb-10 mr-40 ">
              <h1
                className="text-white cursor-pointer flex"
                onClick={() => setClick(!click)}
              >
                Music Languages{' '}
                <span className="pt-1 ml-1">
                  {click ? (
                    <RiArrowUpSLine className="text-white" size={20} />
                  ) : (
                    <RiArrowDownSLine className="text-white" size={20} />
                  )}
                </span>
              </h1>
              <span className="text-white flex capitalize">{language}</span>
            </section>
            <section className=''>
              {click && (
                <form className="mt-4 grid grid-cols-2 gap-4 ">
                  <section className="bg-gray-700 p-4 rounded">
                    <ul className="grid grid-cols-2 gap-4">
                      <li className="text-white mb-2">
                        <label>
                          <input
                            type="checkbox"
                            value="Hindi"
                            checked={language.includes('hindi')}
                            onChange={() => handleLanguageClick('Hindi')}
                            className="mr-2"
                          />
                          Hindi
                        </label>
                      </li>
                      <li className="text-white mb-2">
                        <label>
                          <input
                            type="checkbox"
                            value="English"
                            checked={language.includes('english')}
                            onChange={() => handleLanguageClick('English')}
                            className="mr-2"
                          />
                          English
                        </label>
                      </li>
                      <li className="text-white mb-2">
                        <label>
                          <input
                            type="checkbox"
                            value="Punjabi"
                            checked={language.includes('punjabi')}
                            onChange={() => handleLanguageClick('Punjabi')}
                            className="mr-2"
                          />
                          Punjabi
                        </label>
                      </li>
                      <li className="text-white mb-2">
                        <label>
                          <input
                            type="checkbox"
                            value="Harayanvi"
                            checked={language.includes('harayanvi')}
                            onChange={() => handleLanguageClick('Harayanvi')}
                            className="mr-2"
                          />
                          Harayanvi
                        </label>
                      </li>
                      {/* Add more languages as needed */}
                    </ul>
                  </section>
                </form>
              )}
            </section>
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
