import React, { useState } from 'react'
import SeasonNowAnimeProvider from '../../Providers/SeasonNowAnimeProvider'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router';

const SeasonNowAnime = () => {
   const navigate = useNavigate()
    const {SeasonNowAnime} = SeasonNowAnimeProvider()
    const [showMore, setShowMore] = useState(false)

    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 1280 },
          items: 1
        },
        largeDesktop: {
            breakpoint: { max: 1279, min: 890 },
            items: 1
          },
        desktop: {
          breakpoint: { max: 889, min: 769 },
          items: 1
        },
        tablet: {
          breakpoint: { max: 768, min: 630 },
          items: 1
        },
        semi_tablet: {
            breakpoint: { max: 629, min: 481 },
            items: 1
          },
        mobile: {
          breakpoint: { max: 480, min: 0 },
          items: 1,
          slidesToSlide: 2,
        }
      };

  return (
    <div className='w-full sm:h-fit lg:h-[80svh] lg:max-h-[80svh] bg-red-100 flex items-center relative'>
        
        <Carousel
  swipeable={true}
  draggable={true}
  responsive={responsive}
  infinite={true}
  autoPlaySpeed={3000}
  keyBoardControl={true}
  customTransition="all 0.5s ease"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet","semi_tablet", "mobile"]}
  className="w-full mx-auto h-fit lg:h-[80svh]"
>
  {SeasonNowAnime?.length > 0 &&
    SeasonNowAnime.sort((a,b) => a.popularity - b.popularity).map((anime, index) => {
      if(SeasonNowAnime[index - 1]?.mal_id != anime?.mal_id && anime.title){
        return (
          <section className="w-full h-full  lg:h-[80svh] bg-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Background Image */}{index}
        <img
          src={anime?.images?.webp.large_image_url}
          alt={anime.title || "anime"}
          className="absolute w-full h-full object-cover brightness-30 opacity-70"
        />
      
        {/* Overlay (blur + tint) */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
        <div className="relative mx-3 sm:mx-10 xl:mx-0 z-10 flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-7xl">
          
          {/* Left Side: Anime Info */}
          <div className="text-white flex-1 space-y-5 p-3 md:p-0">
            <div>
            <p className='text-sm text-gray-400 font-light'>Popular animes this season</p>
            <h1 className="text-3xl md:text-4xl lg::text-5xl font-bold line-clamp-2">{anime?.title_english}</h1>
            </div>
            <p className="text-sm text-gray-300 max-w-prose">{anime?.synopsis.substring(0, showMore ? 100000 : 500)}
            {
                anime.synopsis.length > 500 &&
                <button onClick={()=>{setShowMore(!showMore)}} className='inline px-1 font-medium cursor-pointer'>{showMore ? '...see less' : '...see more'}</button>
            }
            </p>
            
      
            <div className="flex flex-wrap gap-4 text-sm text-gray-200">
              <div><span className="font-semibold text-pink-400">Rating:</span> {anime?.score} / 10</div>
              <div><span className="font-semibold text-pink-400">Episodes:</span> {anime?.episodes}</div>
              <div><span className="font-semibold text-pink-400">Status:</span> {anime?.status}</div>
              <div><span className="font-semibold text-pink-400">Season:</span> {anime?.season?.charAt(0).toUpperCase()}{anime?.season?.slice(1)} {anime?.year}</div>
              <div><span className="font-semibold text-pink-400">Genre:</span> {anime?.genres.map((genre)=>genre.name).join(', ')}</div>
              <div><span className="font-semibold text-pink-400">Type:</span> {anime?.type}</div>
            </div>
      
            <button onClick={()=>{navigate(`/anime/${anime?.mal_id}`)}} className="mt-4 bg-pink-600 cursor-pointer hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
              Overview
              </button>
              <button onClick={()=>{window.open(anime?.trailer.url, '_blank').focus();}} className=" hover:bg-gray-50/2 ml-3 mt-4 cursor-pointer bg-transparent border text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
              Watch Trailer
            </button>
          </div>
      
          {/* Right Side: Anime Trailer */}
            <div className="relative hidden md:block aspect-video rounded-lg overflow-hidden w-full md:w-fit md:h-[63svh] lg:h-[40vh]">
                <ReactPlayer
                url={`https://www.youtube.com/watch?v=${anime?.trailer.youtube_id}&?vq=hd720`}
                width="100%"
                height="100%"
                playing={false}
                muted={false}
                loop={true}
                controls={false}
                // className="absolute top-0 left-0"
                />
            </div>
        </div>
        </section>
        )
      }
    })}
</Carousel>

    </div>
  )
}

export default SeasonNowAnime