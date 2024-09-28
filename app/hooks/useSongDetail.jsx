'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const usePlaylist = (query, pageNumber, searchThing) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [songs, setSongs] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    // Reset songs only when query changes
    if (pageNumber === 1) {
      setSongs([])
    }

    axios
      .get(
        `https://tunewaveapi.vercel.app/api/playlists?id=${query}&page=${pageNumber}&limit=10`,
      )
      .then((res) => {
        setSongs((prevSongs) => {
          if (pageNumber === 1) {
            return res.data.data.songs
          } else {
            return [...prevSongs, ...res.data.data.songs]
          }
        })
        setHasMore(res.data.data.songs.length > 0)
        setTotalResults(res.data.data.songs)
        setLoading(false)
      })
      .catch((e) => {
        setError(true)
        setLoading(false)
      })
  }, [query, pageNumber, searchThing])

  return { loading, error, songs, hasMore, totalResults }
}

export default usePlaylist
