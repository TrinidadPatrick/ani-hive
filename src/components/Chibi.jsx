import React from 'react'
import chibi from '../images/chibi.gif'

const Chibi = ({handleScroll}) => {
  return (
    <div className='fixed w-[150px]  group aspect-square cursor-pointer bottom-2 right-0 z-[999999999]'>
        <img src={chibi} alt="chibi" className=' w-full h-full object-cover ' />
            <div className="absolute hidden group-hover:block bottom-[75%] left-1/4 transform -translate-x-1/2">
                <div className="relative bg-themeDark border py-2 border-themeLightDark text-sm flex flex-col gap-3 text-white px-3 rounded-lg shadow-lg origin-bottom">
                <button onClick={() => handleScroll('top')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Top Section</button>
                <button onClick={() => handleScroll('top-animes')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Top Rated Animes</button>
                <button onClick={() => handleScroll('season-now')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Popular this season</button>
                <button onClick={() => handleScroll('ongoing')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Ongoing Animes</button>
                <button onClick={() => handleScroll('airing-today')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Airing Today Animes</button>
                <button onClick={() => handleScroll('upcoming')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Upcoming Animes</button>
                <button onClick={() => handleScroll('movies')} className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200">Anime Movies</button>

                <div className="absolute left-[70%] -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-themeDark"></div>
                </div>
            </div>
      </div>
  )
}

export default Chibi