import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import Image from 'next/image'

const ArtistDetail = ({ data }) => {

  
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-white text-center">No data available</div>
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }

  return (
    <div className="artist-carousel max-w-[20rem] sm:max-w-[30rem]  lg:max-w-[40rem] mx-auto overflow-y-hidden">
      <Carousel responsive={responsive} className="text-white">
        {data.map((artist, index) => (
          <div key={index} className="text-center p-4">
            <div className="bg-gray-800 rounded-full overflow-hidden w-48 h-48 mx-auto flex items-center justify-center">
              {artist?.image?.[2]?.url ? (
                <Image
                  src={artist.image[2].url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  width={192}
                  height={192}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              <h3 className="text-white text-xl">{artist?.name || 'Unknown Artist'}</h3>
              <h3 className="text-white text-lg">Role: {artist?.role || 'Unknown Artist'}</h3>
              {/* <p className="text-gray-400">{artist.description}</p> */}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default ArtistDetail
