'use client'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
}) => {
  return isPlaying && activeSong?.name === song?.name ? (
    <FaPauseCircle
      size={35}
      className="text-gray-300 hover:scale-150"
      onClick={handlePause}
    />
  ) : (
    <FaPlayCircle
      size={35}
      className="text-gray-300 hover:scale-150"
      onClick={handlePlay}
    />
  )
}

export default PlayPause
