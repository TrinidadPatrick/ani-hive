import React, { useEffect, useState } from 'react'
import axios from 'axios'

const OngoingAnime = () => {

  const [ongoingAnime, setOngoingAnime] = useState(null)

  const getOngoingAnime = async (page, retries = 10) => {
    try {
      const query = `
      query {
        Page(perPage: 200) {
          media(status: RELEASING, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
            genres
            episodes
            averageScore
            nextAiringEpisode {
              episode
              airingAt
            }
            startDate {
              year
              month
              day
            }
            siteUrl
          }
        }
      }
    `;
    const response = await axios.post(
      'https://graphql.anilist.co',
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if(response.status === 200) {
      const animes = response.data.data.Page.media
      setOngoingAnime(animes)
    }
  
  } catch (error) {
    console.log(error)
    if(retries > 0)
    {
      setTimeout(()=>{
        getOngoingAnime(1, retries - 1)
      }, 1000)
    }
  }

  }

  useEffect(() => {
    getOngoingAnime()
  }, [])

  console.log(ongoingAnime)
    
  return (
    <div className='w-full bg-[#141414] py-10'>
      <div className="w-[95%] md:w-[90%] mx-auto px-3">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Ongoing Animes</h1>
      <div className='flex justify-between'>
          <p className="text-gray-400 mt-1 text-sm md:text-basetext-white">Animes streaming this season</p>
          <button className='text-sm md:text-base text-white'>See all</button>
      </div>
      
    </div>
    <div className="w-[90%] mx-auto h-full gap-5 bg-[#141414] grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      
      {
        ongoingAnime?.length > 0 &&
        ongoingAnime.map((anime, index, array) =>
        {
          if(array[index - 1]?.id != anime?.id){
            console.log(anime)
            return (
              <div className="w-full h-fit rounded-lg bg-transparent relative overflow-hidden flex flex-col items-center justify-center">
                <div className='absolute z-[999] top-1 left-1 bg-pink-500 px-1 py-0.5 rounded'>
                  <h2 className="text-gray-300 text-center w-full text-sm md:text-sm">
                      Ep {anime?.nextAiringEpisode?.episode + '/'}{anime?.episodes || '??'}
                  </h2>
                </div>
                {/* Image */}
                <img
                  src={anime?.coverImage?.large}
                  alt={anime?.title?.romaji}
                  className=" w-full h-full object-cover rounded-lg brightness-70 aspect-[2/2.3]"
                />

                {/* Info */}
                <div className="w-full px-3 py-1 bottom-0 bg-transparent sm:h-[25%] md:h-[20%] rounded-b-lg flex">
                  <div className="flex flex-col items-start w-full h-full justify-around">
                    <h2 className="text-white text-center text-sm md:text-[0.9rem] mt-1 line-clamp-2 w-full">
                      {anime?.title?.romaji || ''}
                    </h2>
                    <h2 className="text-gray-300 text-center w-full text-sm md:text-sm mt-2">
                      {anime?.genres.join(', ')}
                    </h2>
                  </div>
                </div>
              </div>
            )
          }})
      }
    </div>
    </div>
  )
}

export default OngoingAnime