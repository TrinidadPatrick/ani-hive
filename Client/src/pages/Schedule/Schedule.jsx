import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Footer from '../Home/Footer'

const Schedule = () => {
  const [hovered, setHovered] = useState(false);
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
      const targetDate = getNextDateFromDay(day);
      const options = { timeZone: 'Asia/Tokyo', hour12: false };
  
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
  
  const getAiringAnime = async (day, retries = 10) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/schedules?filter=${day}&limit=20&sfw=true`)
      const uniqueAnimes = response.data.data.filter((obj, index, self) => index === self.findIndex((t) => t.mal_id === obj.mal_id))
      setAnimeList(uniqueAnimes)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAiringAnime(selectedDay  )
  }, [selectedDay])

  console.log(animeList)
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

        <div className='w-[90%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-10 '>
            {animeList?.length > 0 &&
                animeList?.map((anime, index, array) =>
                {
                    if(1 == 1){
                        return (
                          <div 
                          key={index}
                          className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                          onMouseEnter={() => setHovered(index)}
                          onMouseLeave={() => setHovered(-1)}
                        >
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={anime?.images?.jpg?.large_image_url} 
                              alt={anime?.title_english || anime?.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${hovered === index ? 'opacity-100' : 'opacity-70'}`} />
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className={`transition-all duration-300 ${hovered === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
                              <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                                {anime?.title_english || anime?.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>{anime?.aired?.string || 'TBA'}</span>
                              </div>
                            </div>
                            
                            {hovered === index && (
                              <button onClick={()=>navigate(`/anime/${anime?.mal_id}`)} className="cursor-pointer mt-4 px-4 py-2 bg-pink-600 hover:bg-cyan-500 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                                View Details
                              </button>
                            )}
                          </div>
                          
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                            {anime?.score || 'TBD'}
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
    <Footer />
    </main>
  )
}

export default Schedule