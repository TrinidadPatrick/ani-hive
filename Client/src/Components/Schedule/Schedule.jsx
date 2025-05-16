import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const Schedule = () => {
  const navigate = useNavigate()
  const today = new Date().toLocaleString('en-US', { weekday: 'long' })
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [selectedDay, setSelectedDay] = useState(today)
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(false)

  const getNextDateFromDay = (dayName) => {
    const today = new Date();
    const todayDay = today.getDay(); // 0 (Sun) to 6 (Sat)
    const targetDay = days.indexOf(dayName);
  
    if (targetDay === -1) {
      throw new Error("Invalid day name");
    }
  
    let diff = (targetDay - todayDay + 7) % 7;
  
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + diff);
    return new Date(resultDate);
  }

  const getAnimeList = async (day, retries = 10) => {
    try {
      setLoading(true)
      // Get target date (local PH timezone) and convert to JST
      const targetDate = getNextDateFromDay(day); // Returns a JS Date object
      const options = { timeZone: 'Asia/Tokyo', hour12: false };
  
      // Convert targetDate to JST start of day
      const jstStart = new Date(
        new Intl.DateTimeFormat('en-US', {
          ...options,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(targetDate)
      );
  
      const startOfDay = new Date(jstStart);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(jstStart);
      endOfDay.setHours(23, 59, 59, 999);
  
      const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
      const endTimestamp = Math.floor(endOfDay.getTime() / 1000);
  
      const query = `
        query ($start: Int, $end: Int) {
          Page(perPage: 200) {
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
  
      const variables = {
        start: startTimestamp,
        end: endTimestamp,
      };
  
      const response = await axios.post('https://graphql.anilist.co', {
        query,
        variables,
      });
    setAnimeList(response.data.data.Page.airingSchedules);
    } catch (error) {
      console.error(error);
      if (retries > 0) {
        setTimeout(() => {
          getAnimeList(day, retries - 1);
        }, 1000);
      }
    } finally{
        setLoading(false)
    }
  };
  

  useEffect(() => {
    getAnimeList(selectedDay)
  }, [selectedDay])

  // console.log(animeList)

  return (
    <main className='w-full h-[100svh] bg-[#141414] flex flex-col gap-5 md:gap-10 items-center pt-20'>
        <h1 className='text-white text-4xl font-bold'>Schedule</h1>
        {/* Header */}
        <div className='w-full md:w-[80%] justify-center flex flex-wrap gap-5'>
            {
                days.map((day, index)=>{
                    return (
                        <button key={index} onClick={()=>setSelectedDay(day)} className={`text-white font-medium px-3 py-2 ${day == selectedDay ? 'bg-pink-500' : 'bg-[#4a4a4a39]'} hover:bg-pink-500 rounded cursor-pointer`}>
                            {day}
                        </button>
                    )
                })
            }
        </div>

        {/* Anime List */}
        <>
    {
      loading ?
      (
        <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-4 text-white">Airing Today</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
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

        <div className='w-[90%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 lg:gap-10 '>
            {animeList?.length > 0 &&
                animeList?.map((anime, index, array) =>
                {

                    const startDate = `${anime.media.startDate.year}-${Number(anime.media.startDate.month) < 10 ? '0' : ''}${anime.media.startDate.month}-${Number(anime.media.startDate.day) < 10 ? '0' : ''}${anime.media.startDate.day}`
                    const endDate = anime.media.endDate.year != null ? `${anime.media.endDate.year}-${Number(anime.media.endDate.month) < 10 ? '0' : ''}${anime.media.endDate.month}-${Number(anime.media.endDate.day) < 10 ? '0' : ''}${anime.media.endDate.day}` : '????-??-??'
                    if(1 == 1){
                        return (
                            <div onClick={()=>{navigate(`/anime/11111?name=${anime?.media?.title?.romaji}`)}} className='flex cursor-pointer' key={index}>

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
    </main>
  )
}

export default Schedule