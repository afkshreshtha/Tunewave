import React from 'react'
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'

const PlayPause = ({ isPlaying, activeSong, handlePlay, handlePause, song }) => {
  const isActiveSong = activeSong?.id === song?.id

  return (
    <div className='text-white'>
      {isPlaying && isActiveSong ? (
        <AiFillPauseCircle size={30} onClick={handlePause} />
      ) : (
        <AiFillPlayCircle size={30} onClick={handlePlay} />
      )}
    </div>
  )
}

export default PlayPause
