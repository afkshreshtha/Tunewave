'use client'

import { useSelector } from 'react-redux'
import MusicPlayer from './MusicPlayer'

const MusicPlayerWrap = () => {
  const { activeSong } = useSelector((state) => state.player)
  return (
    <div>
      {activeSong?.name && (
        <div>
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default MusicPlayerWrap
