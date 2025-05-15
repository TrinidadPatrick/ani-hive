import axios from 'axios'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Footer from '../Home/Footer'

const Characters = () => {
    const [characters, setCharacters] = useState([])
    const [searching, setSearching] = useState(false)
    const [page, setPage] = useState(1)
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

    // const getPageCount = async (retries = 10) => {
    //     try {
    //         const result = await axios.get(`https://api.jikan.moe/v4/top/characters?limit=1`)
    //         if(result.status === 200) {
    //             const pageCount = result.data.pagination.last_visible_page
    //             return pageCount
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         if(retries > 0)
    //         {
    //             setTimeout(()=>{
    //                 getPageCount(1, retries - 1)
    //             }, 1000)
    //         }
    //     }
    // }

    const getCharacters = async (page, retries = 10) => {
        // const pageCount = await getPageCount()
        setSearching(true)
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/top/characters?page=${page || 1}`)
            console.log(result.data.data)
            setCharacters((prevCharacters) => ([...prevCharacters, ...result.data.data]))
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getCharacters(1, retries - 1)
                }, 1000)
            }
        } finally{
            setSearching(false)
        }
    }

    useEffect(()=>{
        getCharacters(page)
    },[page])

    console.log(characters)

  return (
    <main className='flex flex-col pt-20'>
        <div className='flex flex-col items-start gap-0 w-[90%] mx-auto'>
            <h1 className='text-white w-full text-start text-3xl font-semibold'>Characters</h1>
            <p className='text-gray-400 text-start text-sm'>Popular characters in the anime industry</p>
        </div>
    <div className='w-[90%] relative mx-auto h-fit gap-5 bg-[#141414] grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
        {
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
                        <div key={index} className="w-full h-fit rounded-lg bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center">
                            <div className='absolute z-[999] top-1 left-2 bg-pink-600 px-1 py-0.5 rounded flex items-center gap-0'>
                            <svg
                        className="z-[9999]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="orange"
                          d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
                        />
                            </svg>
                                <h2 className="text-gray-300 text-center w-full text-sm md:text-sm">
                                    {character?.favorites.toLocaleString()}
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
                }
            })
        }
        {
            searching && Array.from({ length: 10 }, (_, index) => index + 7).map((page, index) => {
                return (
                  <div  key={index} className="w-[140px] sm:w-[160px] md:w-[180px] animate-pulse">
                    <div className="relative w-full h-[210px] sm:h-[230px] md:h-[260px] bg-gray-700 rounded-md"></div>
                    <div className="mt-2 h-4 w-3/4 bg-gray-600 rounded"></div>
                    <div className="mt-1 h-4 w-1/2 bg-gray-600 rounded"></div>
                  </div>
                )
              })
        }
    </div>
    <Footer />
    </main>
  )
}

export default Characters