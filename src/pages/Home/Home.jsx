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
import useScrollPosition from '../../stores/ScrollPositionStore.js'


const Home = () => {
  const {topAnimes} = TopAnimeProvider()
  const scrollPosition = useScrollPosition((s) => s.scrollPosition)
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition)
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleSetScrollPosition = () => {
    setScrollPosition(window.pageYOffset)
  }

  useEffect(() => {
    if(scrollPosition){
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        })
      }, 300)
    }
  },[])

  return (
    <main className=' w-full overflow-x-hidden h-full relative bg-themeExtraDarkBlue'>
        <Chibi handleScroll={handleScroll} />
        <div className='relative'>
        <TopSection topAnimes={topAnimes} />
        <div className="absolute bottom-0 w-full h-30 bg-gradient-to-b from-transparent to-themeExtraDarkBlue pointer-events-none"></div>
        </div>
        
        <TopAnimes topAnimes={topAnimes} handleSetScrollPosition={handleSetScrollPosition} />

        <div className='relative '>
        <div className="absolute z-[999] top-0 w-full h-15 bg-gradient-to-t from-transparent to-themeExtraDarkBlue pointer-events-none"></div>
        </div>

        <div className='relative'>
        <SeasonNowAnime handleSetScrollPosition={handleSetScrollPosition} />  
        <div className="absolute bottom-0 w-full h-30 bg-gradient-to-b from-transparent to-themeExtraDarkBlue pointer-events-none"></div>
        </div>
        <OngoingAnime handleSetScrollPosition={handleSetScrollPosition} />
        <AiringToday handleSetScrollPosition={handleSetScrollPosition} />
        <UpcomingAnime handleSetScrollPosition={handleSetScrollPosition} />
        <AnimeMovies handleSetScrollPosition={handleSetScrollPosition} />
        <Footer />
    </main>
  )
}

export default Home