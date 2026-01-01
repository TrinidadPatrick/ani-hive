import React, { useEffect } from 'react'
import TopSection from './TopSection'
import { Link } from 'react-router-dom'
import TopAnimes from './TopAnimes'
import AnimeRecommendation from './AnimeRecommendation'
import SeasonNowAnime from './SeasonNowAnime'
import UpcomingAnime from './UpcomingAnime'
import AnimeMovies from './AnimeMovies'
import AiringToday from './AiringToday'
import OngoingAnime from './OngoingAnime'
import Footer from './Footer'
import chibi from '../../Images/chibi.gif'
import TopAnimeProvider from '../../providers_tmp/TopAnimeProvider.js'


const Home = () => {
  const {topAnimes} = TopAnimeProvider()


  return (
    <main className=' w-full overflow-x-hidden h-full relative bg-[#141414]'>
        <div onClick={()=>{window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })}} className='fixed w-[150px] aspect-square cursor-pointer bottom-2 right-0 z-[999999999]'>
          <img src={chibi} alt="chibi" className='peer w-full h-full object-cover' />
          <div className="absolute hidden peer-hover:block top-0 left-1/2 transform -translate-x-1/2">
          <div className="relative bg-white text-black px-3 py-1 rounded-full shadow-lg">
            <button className="font-semibold whitespace-nowrap">Go to Top</button>

            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
        </div>
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
        <OngoingAnime />
        <AiringToday />
        <UpcomingAnime />
        <AnimeMovies />
        <Footer />
        
        
    </main>
  )
}

export default Home