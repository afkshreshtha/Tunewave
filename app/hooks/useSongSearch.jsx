'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const useSongSearch = (query, pageNumber,searchThing) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [songs, setSongs] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setSongs([])
  }, [query])

  useEffect(() => {
    setLoading(false)
    setError(false)
    axios
      .get(
        `https://tunewaveapi.vercel.app/api/search/${searchThing}?query=${query}&page=${pageNumber}&limit=10`,
      )
      .then((res) => {
        setSongs((prevSongs) => {
          return [...prevSongs, ...res.data.data.results]
        })
        setHasMore(res.data.data.results.length > 0)
        setTotalResults(res.data.data.total)
        setLoading(false)
      })
      .catch((e) => {
        setError(true)
      })
  }, [query, pageNumber,searchThing])

  return { loading, error, songs, hasMore,totalResults }
}

export default useSongSearch
