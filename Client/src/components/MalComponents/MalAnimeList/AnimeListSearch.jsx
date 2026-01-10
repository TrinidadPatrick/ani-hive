import { Filter, Search } from 'lucide-react'
import React, { useRef } from 'react'

const AnimeListSearch = ({searchValue, setSearchValue}) => {
const searchRef = useRef(null)

  const handleSubmitSearch = () => {
    setSearchValue(searchRef.current.value)
  }

  return (
    <div className=' flex items-center gap-2 h-10 '>
        {/* Search Input */}
        <div className='relative bg-[#1b1b1b] rounded-lg border border-[#2e2e2e] w-[17rem] h-full'>
            <Search onClick={()=> handleSubmitSearch()} className=' cursor-pointer absolute hover:text-gray-300 text-gray-400 top-1.5 left-3' width={16} />
            <input onKeyDown={(e) => {if(e.key === 'Enter'){handleSubmitSearch()}}} ref={searchRef} type="text" className='text-gray-200 text-sm pl-10 py-2 outline-none' placeholder='Search anime...' />
        </div>
        {/* Filter */}
        <button className='h-full bg-[#1b1b1b] hover:bg-[#2b2a2a] cursor-pointer aspect-square flex items-center justify-center rounded-lg'>
            <Filter className='text-gray-400' width={18} />
        </button>
    </div>
  )
}

export default AnimeListSearch