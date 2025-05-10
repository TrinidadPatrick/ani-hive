import React from 'react'
import TopSection from './TopSection'
import { Link } from 'react-router-dom'
import TopAnimes from './TopAnimes'
import AnimeRecommendation from './AnimeRecommendation'
import SeasonNowAnime from './SeasonNowAnime'
import UpcomingAnime from './UpcomingAnime'
import AnimeMovies from './AnimeMovies'
import TopAnimeProvider from '../../Providers/TopAnimeProvider'
import AiringToday from './AiringToday'
import OngoingAnime from './OngoingAnime'

const Home = () => {
  const {topAnimes} = TopAnimeProvider()
  return (
    <main className=' w-full h-full relative'>
        
        <div className='relative'>
        <TopSection topAnimes={topAnimes} />
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>
        
        <TopAnimes topAnimes={topAnimes} />

        <div className='relative '>
        <div className="absolute z-[999] top-0 w-full h-7 bg-gradient-to-t from-transparent to-[#141414] pointer-events-none"></div>
        </div>

        <div className='relative'>
        <SeasonNowAnime />  
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>
        <UpcomingAnime />
        <OngoingAnime />
        <AiringToday />
        <AnimeMovies />
        {/* <AnimeRecommendation /> */}
        
    </main>
  )
}

export default Home