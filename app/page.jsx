'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import pop from '../public/pop.png'
import { HomePageData } from './constant'
import { useRouter } from 'next/navigation'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const Discover = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate a delay to show skeleton loaders
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Adjust the time as needed
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <div>
        <h3 className="text-white text-2xl font-bold">Discover your Genres</h3>
      </div>
     
      <div className="text-white grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:gird-cols-10">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div className="p-4 flex flex-col items-center" key={index}>
             <SkeletonTheme baseColor='#343333'>
             <Skeleton height={150} width={150}  />
             <Skeleton height={20} width={150} className="mt-4" />
             <Skeleton height={20} width={150} className="mt-4" />
             </SkeletonTheme>        
            </div>
          ))
        ) : (
          HomePageData.map((data, index) => (
            <div className="p-4 flex flex-col items-center" key={index}>
              <Image
                width={150}
                height={150}
                className="object-cover cursor-pointer"
                src={data.image}
                alt={data.name}
                onClick={() => router.push(`/genre/${data?.title}`)}
              />
              <h4
                className="mt-4 text-lg uppercase cursor-pointer text-center"
                onClick={() => router.push(`/genre/${data.title}`)}
              >
                {data.title}
              </h4>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Discover
