import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AnimeMoviesStore from '../../Store/AnimeMoviesStore';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router';

const AiringToday = () => {
  const AnimeMovies = AnimeMoviesStore((state) => state.AnimeMovies)
  const [airingToday, setAiringToday] = useState(null)
  const navigate = useNavigate()
  
  const getAiringToday = async (page, retries = 10) => {
    const now = new Date();
    const startOfDay = Math.floor(new Date(now.setHours(0, 0, 0, 0)).getTime() / 1000);
    const endOfDay = Math.floor(new Date(now.setHours(23, 59, 59, 999)).getTime() / 1000);
    const query = `
    query ($start: Int, $end: Int) {
      Page(perPage: 50) {
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end) {
          airingAt
          episode
          media {
            isAdult
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            siteUrl
            genres
            description(asHtml: false)
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            status
            format
            episodes
          }
        }
      }
    }
    
    `;

    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query,
        variables: {
          start: startOfDay,
          end: endOfDay
        }
      });
    
      setAiringToday(response.data.data.Page.airingSchedules);
    } catch (error) {
      console.log(error)
      if(retries > 0)
      {
        setTimeout(()=>{
          getAiringToday(1, retries - 1)
        }, 1000)
      }
    }
    // try {
    //     const result = await axios.get(`https://api.jikan.moe/v4/schedules/${weekday}`)
    //     if(result.status === 200) {
    //         const animes = result.data.data
    //         setAiringToday(animes)
    //     }
    // } catch (error) {
    //     console.log(error)
    //     if(retries > 0)
    //     {
    //         setTimeout(()=>{
    //             getAiringToday(1, retries - 1)
    //         }, 1000)
    //     }
    // }
  }

  useEffect(() => {
    if(airingToday === null && AnimeMovies != null) {
      setTimeout(()=>{
        getAiringToday()
      }, 500)
    }
  }, [AnimeMovies])

  return (
    <>
    {
      AiringToday == null ?
      (
        <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-white">Airing Today</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex animate-pulse gap-4 items-center">
            <div className="w-36 h-24 bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
              <div className="h-2 bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-2 bg-pink-500 rounded-full w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      </div>
      )
      :
      (
        <section className="w-full h-fit flex flex-col items-center justify-center bg-[#141414] py-10">
        <div data-aos="fade-right" className="w-[95%] md:w-[90%] mx-auto mb-6 px-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Airing Today</h1>
            <div className='flex justify-between'>
                <p className="text-gray-400 mt-1 text-sm md:text-basetext-white">Animes currently or will be airing today</p>
            </div>
        </div>
        <div className='w-[90%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 lg:gap-10 '>
            {airingToday?.length > 0 &&
                airingToday.filter((anim) => anim.media.isAdult === false).map((anime, index, array) =>
                {

                    const startDate = `${anime.media.startDate.year}-${Number(anime.media.startDate.month) < 10 ? '0' : ''}${anime.media.startDate.month}-${Number(anime.media.startDate.day) < 10 ? '0' : ''}${anime.media.startDate.day}`
                    const endDate = anime.media.endDate.year != null ? `${anime.media.endDate.year}-${Number(anime.media.endDate.month) < 10 ? '0' : ''}${anime.media.endDate.month}-${Number(anime.media.endDate.day) < 10 ? '0' : ''}${anime.media.endDate.day}` : '????-??-??'
                    if(1 == 1){
                        return (
                            <div data-aos="fade-up" onClick={()=>{navigate(`/anime/11111?name=${anime?.media?.title?.romaji}`)}} className='flex cursor-pointer' key={index}>

                            <div className="w-[200px] h-[100px] lg:w-full lg:h-full lg:aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center">
                            {/* Image */}
                            <img
                                src={anime?.media?.coverImage.large}
                                alt={anime?.media?.title?.english || anime?.media?.title?.native}
                                className="absolute aspect-video w-full rounded-lg h-full object-cover brightness-80 opacity-70"
                            />
                            </div>

                            {/* Info */}
                            <div className='h-full w-full px-2 py-1 flex flex-col justify-between'>
                                <div>
                                {/* Title */}
                                <p className="text-white text-sm lg:text-[0.9rem] xl:text-base w-full line-clamp-2">
                                    {anime?.media?.title?.english || anime?.media?.title?.native?.replace(/;/g, ' ') || anime?.media?.title?.english || anime?.media?.title?.native.replace(/;/g, ' ')}
                                </p>
                                {/* Year */}
                                <h2 className="text-gray-300 text-[0.75rem] md:text-[0.8rem]">
                                    {startDate} - {endDate}
                                    {/* {anime?.year || 'N/A'} {anime?.genres[0]?.name} */}
                                </h2>
                                </div>

                                {/* Progress */}
                                <div className='flex flex-col'>
                                    <p className='text-white text-xs'>{anime.episode}/{anime.media.episodes || anime.episode}</p>
                                    <progress value={anime.episode} max={anime.media.episodes || anime.episode} className='progress text-white' />
                                </div>
                            </div>
                            
                            </div>
                        )
                    }
                })}

        </div>
        </section>
      )
    }
    </>
  )
}

export default AiringToday