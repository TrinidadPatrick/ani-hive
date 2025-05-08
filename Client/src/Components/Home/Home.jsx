import React from 'react'
import TopSection from './TopSection'
import { Link } from 'react-router-dom'
import TopAnimes from './TopAnimes'
import AnimeRecommendation from './AnimeRecommendation'
import SeasonNowAnime from './SeasonNowAnime'
import UpcomingAnime from './UpcomingAnime'

const Home = () => {
    const paths = ['/home', '/categories', '/streaming', '/forum']
  return (
    <main className=' w-full h-full relative'>
        
        <div className='relative'>
        <TopSection />
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>
        
        <TopAnimes />

        <div className='relative '>
        <div className="absolute z-[999] top-0 w-full h-7 bg-gradient-to-t from-transparent to-[#141414] pointer-events-none"></div>
        {/* <AnimeRecommendation /> */}
        </div>

        <div className='relative'>
        <SeasonNowAnime />
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>

        <UpcomingAnime />
        
    </main>
  )
}

export default Home