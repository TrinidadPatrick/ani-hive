import React, { useEffect, useState } from 'react'
import SeasonNowAnimeProvider from '../../providers/SeasonNowAnimeProvider'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReactPlayer from 'react-player';
import Youtube from 'react-youtube'
import { useNavigate } from 'react-router';
import NoTrailerAvailable from '../../components/NoTrailerAvailable';
import useSmallScreen from '../../utils/useSmallScreen';

const SeasonNowAnime = () => {
    const navigate = useNavigate()
    const isSmallScreen = useSmallScreen()
    const {SeasonNowAnime} = SeasonNowAnimeProvider()
    const [showMore, setShowMore] = useState(false)
    const [showTrailer, setShowTrailer] = useState(false)
    const [youtubeId, setYoutubeId] = useState('')

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
          slidesToSlide: 1,
        }
    };

    const TrailerPlayer = () => {
        return (
        <main className='fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.9)]'>
                
                {
                    !youtubeId ? (
                        <>
                        <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-20 right-5 z-[99999999999999999]'>Close</button>
                        <NoTrailerAvailable />
                        </>
                    )
                    :
                    (
                    <>
                        {
                            isSmallScreen ? 
                            (
                                <div className='flex flex-col justify-center w-[100vw] h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-10 right-5 z-[99999999999999999]'>Close</button>
                                <ReactPlayer
                                            url={`https://www.youtube.com/watch?v=${youtubeId}&?vq=hd720`}
                                            width="100%"
                                            // height="100%"
                                            playing={true}
                                            muted={false}
                                            loop={true}
                                            controls={false}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className=' flex items-center justify-center w-[100vw] md:h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                    <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-5 right-7 cursor-pointer z-[99999999999999999]'>Close</button>
                                    <ReactPlayer
                                         url={`https://www.youtube.com/watch?v=${youtubeId}&?vq=hd720`}
                                        width="90%"
                                        height="90%"
                                        playing={false}
                                        muted={false}
                                        loop={true}
                                        controls={true}
                                        config={{
                                            youtube: {
                                            playerVars: {
                                                cc_load_policy: 1,
                                                cc_lang_pref: "en"
                                            }
                                            }
                                        }}
                                    />
                                </div>
                            )
                        }
                    </>
                    )
                }
            </main>
        )
    }

  return (
    <>
    {
      SeasonNowAnime == null ?
      (
        <section className="relative w-full min-h-[400px] bg-gradient-to-r from-black/90 to-black/70 px-6 py-10 animate-pulse text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left text section */}
        <div className="flex-1 space-y-4">
          <div className="h-4 w-48 bg-gray-700 rounded" />
          <div className="h-10 w-96 bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-700 rounded" />

          <div className="flex flex-wrap gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-4 w-28 bg-gray-700 rounded" />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <div className="h-10 w-28 bg-pink-700/80 rounded-full" />
            <div className="h-10 w-36 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Right trailer skeleton */}
        <div className="w-full max-w-md h-[230px] bg-gray-700 rounded-lg" />
      </div>

      {/* Optional left/right arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-800/80 rounded-full" />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-800/80 rounded-full" />
        </section>
      )
      :
      (
        <section className='w-full sm:h-fit lg:h-[80svh] lg:max-h-[80svh] bg-red-100 flex items-center relative'>
          {showTrailer && <TrailerPlayer />}
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
              const url = anime?.trailer?.embed_url

              const raw = url.split("?")[0].toString().split("/")
              const yt_id = raw[raw.length - 1]

              return (
                <section className="px-5 w-full h-full  lg:h-[80svh] bg-gray-900 relative overflow-hidden flex items-center justify-center">
              {/* Background Image */}{index}
              <img
                src={anime?.images?.webp.large_image_url}
                alt={anime?.title || "anime"}
                className="absolute w-full h-full object-cover brightness-30 opacity-70"
              />
            
              {/* Overlay (blur + tint) */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
              <div className="relative mx-3 sm:mx-10 xl:mx-0 z-10 flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-7xl">
                
                {/* Left Side: Anime Info */}
                <div className="text-white h-fit flex-1 space-y-5 p-3 md:p-0">
                  <div>
                  <p className='text-sm text-gray-400 font-light'>Popular animes this season</p>
                  <h1 className="text-3xl md:text-4xl lg::text-5xl font-bold line-clamp-2">{anime?.title_english || anime?.title}</h1>
                  </div>
                  <p className="text-sm text-gray-300 max-w-prose">{anime?.synopsis?.substring(0, showMore ? 100000 : 500)}
                  {
                      anime?.synopsis?.length > 500 &&
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
                </div>
            
                {/* Right Side: Anime Trailer */}
                  <div className="relative hidden md:block aspect-video rounded-lg overflow-hidden w-full md:w-fit md:h-[63svh] lg:h-[40vh]">
                      <img src={`https://img.youtube.com/vi/${yt_id}/sddefault.jpg`} alt={anime?.title_english || anime?.title} className='w-full h-full object-cover relative z-10' />
                      <button onClick={()=>{setShowTrailer(true);setYoutubeId(yt_id)}} className='absolute bg-red-500 text-white text-4xl px-6 py-2 rounded-xl hover:bg-red-400 cursor-pointer z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        ▶
                      </button>
                  </div>
              </div>
              </section>
              )
            }
          })}
        </Carousel>

        </section>
      )
    }
    </>
    
  )
}

export default SeasonNowAnime