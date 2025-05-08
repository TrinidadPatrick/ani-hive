import React, { useState } from 'react'
import SeasonNowAnimeProvider from '../../Providers/SeasonNowAnimeProvider'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReactPlayer from 'react-player';

const SeasonNowAnime = () => {
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
    <div className='w-full h-[80svh] max-h-[80svh] bg-[#141414] relative'>
        
        <Carousel
  swipeable={true}
  draggable={true}
  responsive={responsive}
  infinite={false}
  autoPlaySpeed={3000}
  keyBoardControl={true}
  customTransition="all 0.5s ease"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  className="w-full mx-auto h-[80svh]"
>
  {SeasonNowAnime?.length > 0 &&
    SeasonNowAnime.sort((a,b) => a.popularity - b.popularity).map((anime, index) => (
        <section className="w-full md:h-[80svh] bg-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <img
          src={anime?.images?.webp.large_image_url}
          alt={anime.title || "anime"}
          className="absolute w-full h-full object-cover brightness-30 opacity-70"
        />
      
        {/* Overlay (blur + tint) */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
        <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-10 w-full max-w-7xl">
          
          {/* Left Side: Anime Info */}
          <div className="text-white flex-1 space-y-5 p-3 md:p-0">
            <div>
            <p>Popular animes this season</p>
            <h1 className="text-4xl md:text-5xl font-bold">{anime?.title}</h1>
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
      
            <button className="mt-4 bg-pink-600 cursor-pointer hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
              Overview
              </button>
              <button className="ml-3 mt-4 cursor-pointer bg-transparent border text-white font-semibold py-2 px-5 rounded-full shadow-lg transition duration-300">
              Watch Trailer
            </button>
          </div>
      
          {/* Right Side: Anime Trailer */}
            <div className="relative aspect-video rounded-lg overflow-hidden h-[40vh]">
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
    ))}
</Carousel>

    </div>
  )
}

export default SeasonNowAnime