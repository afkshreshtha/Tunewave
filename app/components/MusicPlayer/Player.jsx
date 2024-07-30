import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playPause } from '../../redux/Features/playerSlice'

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}) => {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const { currentIndex } = useSelector((state) => state.player)
  const [shuffle, setshuffle] = useState(false)

  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current
          .play()
          .catch((error) => console.error('Playback error:', error))
      } else {
        ref.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime
    }
  }, [seekTime])

  useEffect(() => {
    const artists = activeSong?.artists.primary.map((e) => e?.name)
    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeSong?.name || 'Unknown Title',
        artist: artists || 'Unknown Artist',
        album: activeSong?.album.name || 'Unknown Album',
        artwork: [
          {
            src: activeSong?.image[2].url || 'default-cover.jpg',
            sizes: '512x512',
            type: 'image/jpg',
          },
        ],
      })

      navigator.mediaSession.setActionHandler('play', () => {
        if (ref.current) {
          ref.current.play()
          dispatch(playPause(true))
        }
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        if (ref.current) {
          ref.current.pause()
          dispatch(playPause(false))
        }
      })

      navigator.mediaSession.setActionHandler('seekto', (event) => {
        if (event.fastSeek && 'fastSeek' in ref.current) {
          ref.current.fastSeek(event.seekTime)
        } else {
          ref.current.currentTime = event.seekTime
        }
      })
    }
  }, [activeSong, dispatch])

  useEffect(() => {
    const handleLoadedData = () => {
      if (ref.current) {
        const duration = ref.current.duration
        if (navigator.mediaSession) {
          navigator.mediaSession.setPositionState({
            duration: isFinite(duration) ? duration : 0,
            playbackRate: ref.current.playbackRate,
            position: ref.current.currentTime,
          })
        }
        console.log('Duration:', duration)
      }
    }

    const audioElement = ref.current
    if (audioElement) {
      audioElement.addEventListener('loadeddata', handleLoadedData)
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [isPlaying])

  return (
    <audio
      src={activeSong?.downloadUrl?.[4]?.url}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
      onError={(e) => console.error('Audio playback error:', e)}
    />
  )
}

export default Player

