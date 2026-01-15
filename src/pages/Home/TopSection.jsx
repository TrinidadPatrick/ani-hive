import React, { useEffect, useState } from 'react'
import topAnimeStore from '../../stores/topAnimeStore'
import TopAnimeProvider from '../../providers/TopAnimeProvider'
import image_1 from '../../images/image_2.jpeg'
import { useNavigate } from 'react-router'
import ReactPlayer from 'react-player'
import useSmallScreen from '../../utils/useSmallScreen'
import getYoutubeId from '../../utils/getYoutubeId'
import TrailerPlayer from '../../components/TrailerPlayer'
import { ArrowUpRight, Calendar, Film, Play, Star } from 'lucide-react'

const TopSection = ({topAnimes}) => {
    const isSmallScreen = useSmallScreen()
    const [topAnime, setTopAnime] = useState(null)
    const [youtubeId, setYoutubeId] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const [showTrailer, setShowTrailer] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(topAnimes !== null && topAnimes.data.length > 0) {
            setTopAnime(topAnimes.data[0])
            const youtubeId = getYoutubeId(topAnimes.data[0]?.trailer.embed_url)
            setYoutubeId(youtubeId)

        }
    }, [topAnimes])

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTrailer]);

    return (
      <main id='top'>
        {
          topAnime == null ?
          (
            <section className="relative lg:h-[100svh] flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 bg-gradient-to-r from-black via-transparent to-black text-white animate-pulse">
            {/* Left content skeleton */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-4 w-24 bg-gray-700 rounded" />
              <div className="h-10 w-3/4 bg-gray-700 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-700 rounded" />
                <div className="h-3 w-11/12 bg-gray-700 rounded" />
                <div className="h-3 w-10/12 bg-gray-700 rounded" />
                <div className="h-3 w-9/12 bg-gray-700 rounded" />
                <div className="h-3 w-8/12 bg-gray-700 rounded" />
              </div>
      
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="h-3 w-24 bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-700 rounded" />
                <div className="h-3 w-28 bg-gray-700 rounded" />
                <div className="h-3 w-32 bg-gray-700 rounded" />
              </div>
      
              <div className="flex gap-4 pt-6">
                <div className="h-10 w-28 bg-gray-700 rounded-full" />
                <div className="h-10 w-32 bg-gray-700 rounded-full" />
              </div>
            </div>
      
            {/* Poster skeleton */}
            <div className="w-[1/2] lg:w-1/4 mt-10 lg:mt-0">
              <div className="w-full aspect-[3/4] bg-gray-700 rounded-2xl shadow-lg" />
            </div>
            </section>
          )
          :
          (
            <section className="w-full md:h-[100svh] bg-gray-900 relative overflow-hidden flex items-center justify-center lg:px-6">
              {showTrailer && <TrailerPlayer youtubeId={youtubeId} setShowTrailer={setShowTrailer} />}
              {/* Background Image */}
              <img
                src={topAnime?.images?.webp.large_image_url}
                alt={topAnime?.title}
                className="absolute w-full h-full object-cover brightness-20 opacity-70"
              />

              {/* Overlay (blur + tint) */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
              <div className="relative mx-3 sm:mx-10 xl:mx-0 z-10 flex flex-col-reverse md:flex-row items-center gap-10 w-full max-w-7xl">
                
                {/* Left Side: Anime Info */}
                <div className=" flex-1 space-y-5 p-3 md:p-0">
                  <div className='flex flex-col'>
                  <p className='text-pink-500'>#1 Anime</p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{topAnime?.title}</h1>
                    <div className='mt-4 flex gap-3 text-white'>
                      <div className='flex gap-2 items-center'>
                        <Star width={17} className='text-amber-300 fill-amber-300' />
                        {topAnime?.score}
                      </div>
                      <div className='flex gap-2 items-center'>
                        <Film width={17} className='' />
                        {topAnime?.episodes} Episodes
                      </div>
                      <div className='flex gap-2 items-center'>
                        <Calendar width={17} className='' />
                        {topAnime?.season[0].toUpperCase()}{topAnime?.season?.slice(1)} {topAnime?.year}
                      </div>
                    </div>

                    <div className='flex gap-2 mt-5'>
                      {topAnime?.genres.map((genre, index)=> (
                        <div key={index} className='text-sm px-4 py-1 rounded-full bg-themeDark border border-themeLightDark text-white'>
                          {genre.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-base text-gray-300 max-w-xl">{topAnime?.synopsis.substring(0, showMore ? 100000 : 300)}
                  <button onClick={()=>{setShowMore(!showMore)}} className='inline px-1 font-medium cursor-pointer'>{showMore ? '...see less' : '...see more'}</button></p>
                  
                  <div className='flex'>
                    <button onClick={()=>{navigate(`/anime/${topAnime?.mal_id}?title=${topAnime?.title || ''}`)}} className="flex items-center gap-2 mt-4 bg-pink-600 cursor-pointer hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition duration-300">
                      <ArrowUpRight width={17} />
                      Overview
                    </button>
                    <button onClick={()=>{setShowTrailer(true)}} className=" hover:bg-gray-50/2 flex items-center ml-3 mt-4 cursor-pointer bg-transparent border text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition duration-300">
                      <Play width={17} />
                      Watch Trailer
                    </button>
                  </div>
                </div>

                {/* Right Side: Anime Poster */}
                <div className="flex-1 w-full max-w-sm md:max-w-[300px] xl:max-w-[400px] mt-20 md:mt-0 md:ml-10">
                  <img
                    src={topAnime?.images?.webp.large_image_url}
                    alt={topAnime?.title}
                    style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                    className="w-full rounded-xl shadow-2xl hover:scale-105 cursor-pointer transition-all duration-500 ease-in-out transform brightness-75"
                  />
                </div>
              </div>
            </section>
          )
        }
        
      </main>
    )
}

export default TopSection