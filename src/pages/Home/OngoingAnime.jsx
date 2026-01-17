import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import localforage from 'localforage'
import { motion } from "framer-motion";
import { Flame } from 'lucide-react';

const OngoingAnime = ({handleSetScrollPosition}) => {
  const navigate = useNavigate()
  const [ongoingAnime, setOngoingAnime] = useState(null)

  const getOngoingAnime = async (page = 1, retries = 10) => {
    if (page === 1) {
      const cached = await localforage.getItem('ongoingAnime');
      if (cached) setOngoingAnime(cached);
    }

    try {
      const query = `
      query($page: Int) {
        Page(page: $page, perPage: 40) {
        pageInfo {
          hasNextPage
          currentPage
        }
          media(status: RELEASING, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
            id
            idMal
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            genres
            episodes
            nextAiringEpisode {
              episode
              airingAt
            }
            siteUrl
            trending
            popularity
          }
        }
      }
    `;
    const response = await axios.post(
      'https://graphql.anilist.co',
      { query, variables: { page} },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if(response.status === 200) {
      const animes = response.data.data.Page.media
      const pageInfo = response.data.data.Page.pageInfo
      setOngoingAnime(prev => {
        const animeMap = new Map((prev || []).map(item => [item.id, item]));
        animes.forEach(item => animeMap.set(item.id, item));
        const updated = Array.from(animeMap.values());
        
        localforage.setItem('ongoingAnime', updated);
        
        return updated;
      });


      if(pageInfo?.hasNextPage){
        setTimeout(()=>{
            getOngoingAnime(page + 1)
        }, 50)
      }
      
    }
  
  } catch (error) {
    console.log(error)
    if(retries > 0 && error.status === 429)
    {
      setTimeout(()=>{
        getOngoingAnime(page, retries - 1)
      }, 1000)
    }
  }

  }

  const processedAnime = useMemo(() => {
  return ongoingAnime?.map((anime, index) => ({
    ...anime,
    // First 10 by popularity are "Popular"
    isPopular: index < 10,
    // Trending score over 80 is "Hot"
    isHot: anime.trending > 80,
    // High score is "Top Rated"
    isTopRated: anime.averageScore > 80 
  }));
}, [ongoingAnime]);

  useEffect(() => {
    getOngoingAnime()
  }, [])



  return (
  <main id='ongoing'>
    {
      ongoingAnime == null ?
      (
      <section className="p-6">
      <h2 className="text-3xl font-bold mb-4">Ongoing Anime</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-40 bg-gray-700"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
        </section>
      )
      :
      (
        <section className='w-full bg-themeExtraDarkBlue py-10'>
      <div className="w-[95%] md:w-[90%] mx-auto">
      <h1  className="text-2xl md:text-3xl font-bold text-white">Ongoing Anime</h1>
      <div className='flex justify-between'>
          <p  className="text-gray-400 mt-1 text-sm md:text-basetext-white">Animes streaming this season</p>
      </div>
      
    </div>
    <div className="w-[90%] mx-auto gap-5  grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {
        ongoingAnime?.length > 0 &&
        processedAnime?.map((anime, index, array) =>
        {
          if(array[index - 1]?.id != anime?.id){
            return (
              <motion.div
                  key={anime.id}
                  layout="position"
                  className=""
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  >
              <div  key={index} onClick={()=> {navigate(`/anime/${anime?.idMal}?title=${anime?.title?.romaji || ''}`);handleSetScrollPosition()}} className="w-full rounded-lg cursor-pointer relative overflow-hidden flex flex-col items-center ">
                {/* Image */}
                <div className='rounded-lg overflow-hidden flex-none relative'>
                  {/* badge */}
                  {anime.isHot && anime.isPopular &&
                  <div className='absolute z-20 bg-gradient-to-br from-orange-500 via-red-600 to-red-700 border border-orange-400/30 w-30 -rotate-45 top-5 -left-7 flex justify-center text-gray-200 items-center gap-2'>
                    <Flame width={16} className='fill-amber-50' />
                    Hot
                  </div>
                  }
                <img
                  src={anime?.coverImage?.large}
                  alt={anime?.title?.romaji}
                  className=" w-full h-full hover:scale-105 object-cover rounded-lg aspect-[2/2.3]"
                />
                </div>

                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                  {(anime?.nextAiringEpisode?.episode - 1 || '??') + ' / '}{anime?.episodes || '??'}
                </div>

                {/* Info */}
                <div className="w-full px-1 py-1 bottom-0 bg-transparent rounded-b-lg flex h-full">
                  <div className="flex flex-col items-start w-full h-full justify-between b">
                    <h2 className="text-white font-medium text-start text-sm md:text-[0.9rem] mt-1 line-clamp-2 w-full">
                      {anime?.title?.english || anime?.title?.romaji}
                    </h2>
                    <div className=' z-[999] w-full py-0.5 mt-2 '>
                      <div className="text-gray-300 text-start gap-2 rounded text-xs md:text-[0.8rem] line-clamp-1">
                          {anime?.genres?.slice(0,2).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
            )
          }})
      }
    </div>
    </section>
      )
    }
  </main>
  )
}

export default OngoingAnime