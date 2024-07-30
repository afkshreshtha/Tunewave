'use client'

import Image from 'next/image'
import pop from '../public/pop.png'
import { HomePageData } from './constant'
import { useRouter } from 'next/navigation'
const Discover = () => {
  const router = useRouter()
  return (
    <>
      <div>
        <h3 className="text-white text-2xl font-bold">Discover your Genres</h3>
      </div>
      <div className="text-white grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:gird-cols-10">
        {HomePageData.map((data, index) => {
          return (
            <div className=" p-5 " key={index} >
              <Image
                full
                width={180}
                height={180}
                className=" object-cover cursor-pointer"
                src={data.image}
                alt={data.name}
                onClick={()=>router.push(`/genre/${data?.title}`)}
              />
              <h4 className="mt-4 text-xl uppercase cursor-pointer"onClick={()=>router.push(`/genre/${data.title}`)}>{data.title}</h4>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Discover
