import axios from 'axios'
import { ChevronDown, Filter, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useOutsideClick } from '../../../hooks/useOutsideClick'
import generateDate from '../../../utils/generateDate'

const AnimeListSearch = ({setGenreValue, setSearchValue, setDateValue}) => {
  const ref = useRef(null)
  const searchRef = useRef(null)
  const dates = generateDate(1970)
  const [dropdownOpen, setDropdownOpen] = useState('')
  const [genres, setGenres] = useState([])
  const [themes, setThemes] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedDate, setSelectedDate] = useState({
        startDate: {
          year: null, month: null, day: null
        },
        endDate: {
          year: null, month: null, day: null
        }
    });

  const handleSubmitSearch = () => {
    setSearchValue(searchRef.current.value)
  }

  const handleSelectGenre = (value) => {
    if(!selectedGenres.includes(value)){
      return setSelectedGenres((prev) =>([...prev, value]))
    }
    setSelectedGenres(selectedGenres.filter((genre)=> genre !== value))
  }

  const handleSubmitFilter = () => {
    setGenreValue(selectedGenres)
    setDateValue(selectedDate)
  }

  const handleClearFilter = () => {
    const intialDateValue = {
        startDate: {
          year: null, month: null, day: null
        },
        endDate: {
          year: null, month: null, day: null
        }
    }
    setSelectedGenres([])
    setGenreValue([])
    setDateValue(intialDateValue)
    setSelectedDate(intialDateValue)
  }

  const getGenres = async (retries = 10) => {
    try {
      const result = await axios.get(`https://api.jikan.moe/v4/genres/anime`);
      if(result.status === 200) {
        const genres = result.data.data
        const themes = [...genres]
        themes.splice(0,22)
        setGenres(genres?.slice(0,18))
        setThemes(themes)
        
      }
    } catch (error) {
      console.log(error)
      if(retries > 0)
      {
        setTimeout(()=>{
          getGenres(retries - 1)
        }, 1000)
      }
    }
  }

  useOutsideClick(ref, () => setDropdownOpen(''))
 
  const FilterModal = () => {
      if(!isOpen) return null
        return (
            <main className='fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.2)]'>
                <div className='absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-slate-900 p-4 w-2xl rounded-lg max-h-full'>
                    <button onClick={()=>setIsOpen(false)} className='text-white absolute right-5 cursor-pointer hover:text-gray-300'><X width={17} /></button>
                    <h2 className='font-bold text-xl text-white text-center pb-3'>Select Filter</h2>
                    <div ref={ref} className='flex flex-col gap-2 w-fit'>
                      {/* Genres */}
                      <div className='flex gap-3'>
                        <h3 className='text-white font-medium w-20'>Genre</h3>
                        <span className='text-white'> - </span>
                          <div className=' relative'>
                            <button onClick={()=>setDropdownOpen(dropdownOpen === 'genre' ? '' : 'genre')} className='bg-slate-800 hover:bg-slate-700 flex items-center gap-2 text-white  px-3 py-1 rounded-lg text-sm'>{genres[0]?.name} <ChevronDown className='text-white' width={17} /></button>
                            <div className={`z-90 ${dropdownOpen === 'genre' ? '' : 'hidden'} recoList absolute rounded-lg left-0 bg-slate-800 top-10 max-h-80 overflow-y-scroll`}>
                              {
                                genres.length !== 0 && genres.map((genre, index) => {
                                  return (
                                    <div key={index} onClick={()=>handleSelectGenre(genre.name)} className='text-white hover:bg-slate-700 whitespace-nowrap gap-2 flex text-sm p-2 cursor-pointer'>
                                      <input defaultChecked={selectedGenres.includes(genre.name)} type='checkbox' />
                                      {genre.name}
                                      </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                      </div>
                      {/* Themes */}
                      <div className='flex gap-3'>
                        <h3 className='text-white font-medium w-20'>Themes</h3>
                        <span className='text-white'> - </span>
                          <div className=' relative'>
                            <button onClick={()=>setDropdownOpen(dropdownOpen === 'theme' ? '' : 'theme')} className='bg-slate-800 hover:bg-slate-700 flex items-center gap-2 text-white  px-3 py-1 rounded-lg text-sm'>{themes[0]?.name} <ChevronDown className='text-white' width={17} /></button>
                            <div className={`z-90 ${dropdownOpen === 'theme' ? '' : 'hidden'} recoList absolute rounded-lg left-0 bg-slate-800 top-10 max-h-80 overflow-y-scroll`}>
                              {
                                themes.length !== 0 && themes.map((theme, index) => {
                                  return (
                                    <div key={index} onClick={()=>handleSelectGenre(theme.name)} className='text-white hover:bg-slate-700 whitespace-nowrap gap-2 flex text-sm p-2 cursor-pointer'>
                                      <input defaultChecked={selectedGenres.includes(theme.name)} type='checkbox' />
                                      {theme.name}
                                      </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                      </div>
                      {/* Air Date */}
                      <div className='flex gap-3'>
                        <h3 className='text-white font-medium w-20'>Start Date</h3>
                        <span className='text-white'> - </span>
                          {
                            Object.entries(dates).map(([key, value], index) => {
                              return (
                                <div key={index} className='relative'>
                                  <button onClick={()=>setDropdownOpen(dropdownOpen === key ? '' : key)} className='bg-slate-800 hover:bg-slate-700 flex items-center gap-2 text-white  px-3 py-1 rounded-lg text-sm cursor-pointer'>{selectedDate['startDate'][key] || '--'} <ChevronDown className='text-white' width={17} /></button>
                                  <div className={`z-90 ${dropdownOpen === key ? '' : 'hidden'} recoList absolute rounded-lg left-0 bg-slate-800 top-10 max-h-80 overflow-y-scroll`}>
                                    {
                                      value.map((item, index) => {
                                        return (
                                          <div key={index} onClick={()=>setSelectedDate((prev)=>({...prev, startDate: {...prev.startDate, [key] : item}}))} className='text-white hover:bg-slate-700 whitespace-nowrap gap-2 flex text-sm p-2 cursor-pointer'>
                                            <input defaultChecked={selectedDate['startDate'][key] === item} type='checkbox' />
                                            {item}
                                            </div>
                                        )
                                      })
                                    }
                                  </div>
                                </div>
                              )
                            })
                          }
                      </div>
                      {/* End Date */}
                      <div className='flex gap-3'>
                        <h3 className='text-white font-medium w-20'>End Date</h3>
                        <span className='text-white'> - </span>
                          {
                            Object.entries(dates).map(([key, value], index) => {
                              return (
                                <div key={index} className=' relative'>
                                  {/* Year */}
                                  <button onClick={()=>setDropdownOpen(dropdownOpen === key + '1' ? '' : key + '1')} className='bg-slate-800 hover:bg-slate-700 flex items-center gap-2 text-white  px-3 py-1 rounded-lg text-sm cursor-pointer'>{selectedDate['endDate'][key] || '--'} <ChevronDown className='text-white' width={17} /></button>
                                  <div className={`z-90 ${dropdownOpen === key + '1' ? '' : 'hidden'} recoList absolute rounded-lg left-0 bg-slate-800 top-10 max-h-80 overflow-y-scroll`}>
                                    {
                                      value.map((item, index) => {
                                        return (
                                          <div key={index} onClick={()=>setSelectedDate((prev)=>({...prev, endDate: {...prev.endDate, [key] : item}}))} className='text-white hover:bg-slate-700 whitespace-nowrap gap-2 flex text-sm p-2 cursor-pointer'>
                                            <input defaultChecked={selectedDate['endDate'][key] === item} type='checkbox' />
                                            {item}
                                            </div>
                                        )
                                      })
                                    }
                                  </div>
                                </div>
                              )
                            })
                          }
                      </div>
                    </div>
                    <div className='w-full flex justify-end gap-2'>
                      <button onMouseDown={handleClearFilter} className='bg-gray-600 hover:bg-gray-500 cursor-pointer px-3 py-1 rounded-md text-white text-sm mt-2'>Clear filter</button>
                      <button onMouseDown={handleSubmitFilter} className='bg-pink-600 hover:bg-pink-500 cursor-pointer px-3 py-1 rounded-md text-white text-sm mt-2'>Submit filter</button>
                    </div>
                    </div>
            </main>
        )
  }

  useEffect(()=>{
    getGenres()
  },[])

  return (
    <div className=' flex items-center gap-2 h-10 w-full lg:w-fit px-4 '>
        {/* Search Input */}
        <div className='relative bg-[#1b1b1b] rounded-lg border border-[#2e2e2e] w-full lg:w-[17rem] h-full'>
            <Search onClick={()=> handleSubmitSearch()} className=' cursor-pointer absolute hover:text-gray-300 text-gray-400 top-1.5 left-3' width={16} />
            <input onKeyDown={(e) => {if(e.key === 'Enter'){handleSubmitSearch()}}} ref={searchRef} type="text" className='text-gray-200 text-sm pl-10 pr-3 py-2 outline-none  w-full' placeholder='Search anime...' />
        </div>
        {/* Filter */}
        <button onClick={()=>setIsOpen(true)} className='h-full bg-[#1b1b1b] hover:bg-[#2b2a2a] cursor-pointer aspect-square flex items-center justify-center rounded-lg'>
            <Filter className='text-gray-400' width={18} />
        </button>
        <FilterModal />
    </div>
  )
}

export default AnimeListSearch