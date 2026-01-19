import axios from 'axios'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Footer from '../Home/Footer'
import useErrorHandler from '../../stores/FetchErrorHandler.js'
import CharacterCard from './CharacterCard.jsx'
import { Search, X } from 'lucide-react'

const Characters = () => {
    const setErrorStatus = useErrorHandler((s) => s.setErrorStatus)
    const [characters, setCharacters] = useState([])
    const [searching, setSearching] = useState(false)
    const [page, setPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const observer = useRef();


    const lastItemRef = useCallback(
        node => {
          if (observer.current) observer.current.disconnect();
    
          observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              setPage((prevPage) => prevPage + 1);
            }
          });
    
          if (node) observer.current.observe(node);
        },
        []
    );

    const getCharacters = async (page , searchValue, option, retries = 0) => {
        setSearching(true)
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/characters?q=${searchValue || ''}&page=${page || 1}&order_by=favorites&sort=desc`)
            option == 1 ? setCharacters((prevCharacters) => ([...prevCharacters, ...result.data.data])) : setCharacters(result.data.data)
        } catch (error) {
            setErrorStatus(error.status)
            if(retries > 0 && error.status === 429)
            {
                console.log(retries)
                setTimeout(()=>{
                    getCharacters(page,searchValue,option, retries - 1)
                }, 1000)
            }
        } finally{
            setSearching(false)
        }
    }

    useEffect(()=>{
        getCharacters(page, searchValue, 1)
    },[page])

    console.log(searching)
  return (
    <main className='flex flex-col pt-20 bg-themeExtraDarkBlue min-h-[100svh] gap-5'>
        <div className='flex flex-col sm:flex-row w-[90%] mx-auto'>
        <div className='flex flex-col items-start gap-0 w-full mx-auto'>
            <h1 className='text-white w-full text-start text-3xl font-semibold'>Characters</h1>
            <p className='text-gray-400 text-start text-sm'>Popular characters in the anime industry</p>
        </div>
        <div className='flex w-full mt-3 sm:mt-0 sm:w-[340px] gap-3 items-center relative'>
          <input onKeyDown={(e)=>{if(e.key === 'Enter'){getCharacters(1, e.target.value, 2)}}} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} type="text" 
          className=" outline-0 w-full ps-9 h-10 bg-themeDarker border border-themeLightDark rounded-lg text-white placeholder:text-gray-400 text-sm" placeholder="Search character" />
          <button onClick={()=>getCharacters(1, searchValue, 2)} className="text-white absolute left-3 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
            <Search width={17} className='text-gray-400' /> 
          </button>
          <button onClick={()=>{setSearchValue('');getCharacters(1, '', 2)}} className="text-white absolute right-3 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
            <X width={17} className='text-gray-400' /> 
          </button>
        </div>
        </div>
        <div className='w-[90%] relative mx-auto flex-1 gap-5 grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
            {   
                searching ? 
                Array.from({ length: 10 }, (_, index) => index + 7).map((page, index) => {
                    return (
                    <div  key={index} className="w-[140px] sm:w-[160px] md:w-[180px] animate-pulse">
                        <div className="relative w-full h-[210px] sm:h-[230px] md:h-[260px] bg-gray-700 rounded-md"></div>
                        <div className="mt-2 h-4 w-3/4 bg-gray-600 rounded"></div>
                        <div className="mt-1 h-4 w-1/2 bg-gray-600 rounded"></div>
                    </div>
                    )
                })
                :
                characters?.length > 0 &&
                characters.map((character, index, array) =>
                {
                    if(index == array.length - 1){
                        return (
                            <div ref={lastItemRef} key={index} className="w-full h-fit rounded-lg bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center">
                                <div className='absolute z-[999] top-1 left-2 bg-pink-600 px-1 py-0.5 rounded'>
                                    <h2 className="text-gray-300 text-center w-full text-sm md:text-sm">
                                        {character?.favorites}
                                    </h2>
                                </div>
                                {/* Image */}
                                <div className='rounded-lg overflow-hidden'>
                                <img
                                    src={character?.images?.webp?.image_url}
                                    alt={character?.name}
                                    className=" w-full h-full hover:scale-105 object-cover rounded-lg brightness-70 aspect-[2/2.8]"
                                />
                                </div>
        
                                {/* Info */}
                                <div className="w-full px-3 py-1 bottom-0 bg-transparent sm:h-[25%] md:h-[20%] rounded-b-lg flex">
                                    <div className="flex flex-col items-start w-full h-full justify-around">
                                        <h2 className="text-white text-center text-sm md:text-[0.9rem] mt-1 line-clamp-2 w-full">
                                            {character?.name}
                                        </h2>
                                        <h2 className="text-gray-300 text-center w-full text-sm md:text-sm mt-2">
                                            {character?.role}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        )
                    }else{
                        return (
                            <CharacterCard key={`${character.mal_id}-${index}`} character={character} />
                        )
                    }
                })
            }
        </div>
        <Footer />
    </main>
  )
}

export default Characters