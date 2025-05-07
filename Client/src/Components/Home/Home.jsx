import React from 'react'
import TopSection from './TopSection'
import { Link } from 'react-router-dom'
import TopAnimes from './TopAnimes'

const Home = () => {
    const paths = ['/home', '/categories', '/streaming', '/forum']
  return (
    <main className=' w-full h-full relative'>
        
        <div className='relative'>
        <TopSection />
        <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
        </div>
        <TopAnimes />
    </main>
  )
}

export default Home