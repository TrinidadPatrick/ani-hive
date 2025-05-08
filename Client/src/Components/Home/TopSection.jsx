import React, { useEffect, useState } from 'react'
import topAnimeStore from '../../Store/topAnimeStore'
import TopAnimeProvider from '../../Providers/TopAnimeProvider'
import image_1 from '../../Images/image_2.jpeg'

const TopSection = () => {
    const [topAnime, setTopAnime] = useState(null)
    const {topAnimes} = TopAnimeProvider()
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        if(topAnimes !== null && topAnimes.data.length > 0) {
            setTopAnime(topAnimes.data[0])
        }
    }, [topAnimes])

    return (
  <section className="w-full md:h-[100svh] bg-gray-900 relative overflow-hidden flex items-center justify-center">
  {/* Background Image */}
  <img
    // src={image_1}
    src={topAnime?.images?.webp.large_image_url}
    alt="Top Anime"
    className="absolute w-full h-full object-cover brightness-30 opacity-70"
  />

  {/* Overlay (blur + tint) */}
  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
  <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 w-full max-w-7xl">
    
    {/* Left Side: Anime Info */}
    <div className="text-white flex-1 space-y-5 p-3 md:p-0">
      <div>
      <p>#1 Anime</p>
      <h1 className="text-4xl md:text-5xl font-bold">{topAnime?.title}</h1>
      </div>
      <p className="text-sm text-gray-300 max-w-prose">{topAnime?.synopsis.substring(0, showMore ? 100000 : 500)}
      <button onClick={()=>{setShowMore(!showMore)}} className='inline px-1 font-medium cursor-pointer'>{showMore ? '...see less' : '...see more'}</button></p>
      

      <div className="flex flex-wrap gap-4 text-sm text-gray-200">
        <div><span className="font-semibold text-pink-400">Rating:</span> {topAnime?.score} / 10</div>
        <div><span className="font-semibold text-pink-400">Episodes:</span> {topAnime?.episodes}</div>
        <div><span className="font-semibold text-pink-400">Season:</span> {topAnime?.season[0].toUpperCase()}{topAnime?.season?.slice(1)} {topAnime?.year}</div>
        <div><span className="font-semibold text-pink-400">Genre:</span> {topAnime?.genres.map((genre)=>genre.name).join(', ')}</div>
      </div>

      <button className="mt-4 bg-pink-600 cursor-pointer hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
        Overview
        </button>
        <button className="ml-3 mt-4 cursor-pointer bg-transparent border text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
        Watch Trailer
      </button>
    </div>

    {/* Right Side: Anime Poster */}
    <div className="flex-1 max-w-sm mt-20 md:mt-0 md:ml-10">
      <img
        src={topAnime?.images?.webp.large_image_url}
        alt={topAnime?.title}
        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
        className="w-full rounded-xl shadow-2xl hover:scale-105 cursor-pointer transition-all duration-500 ease-in-out transform brightness-75"
      />
    </div>
  </div>
</section>

    )
}

export default TopSection