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
import chibi from '../../images/chibi.gif'
import TopAnimeProvider from '../../providers/TopAnimeProvider.js'
import Chibi from '../../components/Chibi.jsx'


const Home = () => {
  const {topAnimes} = TopAnimeProvider()

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <main className=' w-full overflow-x-hidden h-full relative bg-themeDarkest'>
        <Chibi handleScroll={handleScroll} />
        <div className='relative'>
        <TopSection topAnimes={topAnimes} />
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>
        
        <TopAnimes topAnimes={topAnimes} />

        <div className='relative '>
        <div className="absolute z-[999] top-0 w-full h-15 bg-gradient-to-t from-transparent to-themeDarkest pointer-events-none"></div>
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