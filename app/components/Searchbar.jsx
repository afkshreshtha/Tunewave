"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'


import { FiSearch } from 'react-icons/fi'
const Searchbar = () => {

  const [searchTerm, setSearchTerm] = useState('')
const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/search/${searchTerm}`)
  }
  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="p-2 text-gray-400 focus-within:text-gray-600"
    >
      <label htmlFor="search-field" className="sr-only">
        Search all songs
      </label>
      <div className="flex flex-row justify-start items-center">
        <FiSearch className="w-5 h-5 nl-4" />
        <input
          name="search-field"
          autoComplete="off"
          id="search-field"
          placeholder="Search"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none placeholder-gray-500 text-white p-4 text-base"
        />
      </div>
    </form>
  )
}

export default Searchbar
