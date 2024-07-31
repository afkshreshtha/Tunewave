import React from 'react'
import { useGetLyricsQuery } from '../../../redux/services/jioSavaanapi'

export default function Lyrics({songId}) {
    const {data,isFetching,error} = useGetLyricsQuery({songid:songId})
    const lyrics = data?.data?.lyrics.replace(/\n/g, '<br>')
    return (
    <div>
      <div className="mt-8">
        <h3 className="text-white text-2xl font-bold text-center mb-4">
          Lyrics
        </h3>
        <div className="bg-gray-800 text-center p-4 rounded-lg text-white max-h-96 overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: lyrics || 'Lyrics not available' }} />
        </div>
      </div>
    </div>
  )
}
