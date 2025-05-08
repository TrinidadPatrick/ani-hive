import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import axios from 'axios';

const UpcomingAnime = () => {
  const [upcomingAnime, setUpcomingAnime] = useState(null)
  const prevRef = useRef(null);
  const nextRef = useRef(null);

    const getUpcomingAnime = async (page) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/seasons/upcoming?page=${page || 1}`)
            if(result.status === 200) {
                const animes = result.data
                console.log(animes)
                setUpcomingAnime(animes)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(upcomingAnime === null) {
            getUpcomingAnime()
        }
    }, [])

    console.log(upcomingAnime)

  return (
    <div className="w-full h-[65svh] bg-[#141414] py-10">
        <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Upcoming Anime</h1>
        <div className='flex justify-between'>
            <p className="text-gray-400 mt-1 text-sm md:text-basetext-white">Anticipated upcoming anime</p>
            <button className='text-sm md:text-base text-white'>See all</button>
        </div>
        
        </div>
        <div className=' relative'>
            <button ref={prevRef} className=" cursor-pointer hover:text-gray-400 swiper-button-prev-custom hidden lg:block absolute left-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2">
                ◀
            </button>
            <button ref={nextRef} className=" cursor-pointer hover:text-gray-400 swiper-button-next-custom hidden lg:block absolute right-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2">
                ▶
            </button>
        <Swiper
        modules={[FreeMode, Navigation]}
        freeMode={true}
        spaceBetween={20}
        slidesPerView={2}
        slidesPerGroup={1}  grabCursor={true}
        navigation={{
        nextEl: nextRef.current,
        prevEl: prevRef.current,
        }}
        breakpoints={{
        0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        481: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
        630: {
            slidesPerView: 4,
            slidesPerGroup: 4,
        },
        769: {
            slidesPerView: 4,
            slidesPerGroup: 4,
        },
        890: {
            slidesPerView: 5,
            slidesPerGroup: 5,
        },
        1280: {
            slidesPerView: 7,
            slidesPerGroup: 7,
        },
        }}
        onBeforeInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-[95%] md:w-[90%] mx-auto "
    >
        {upcomingAnime?.data?.length > 0 &&
        upcomingAnime.data.map((anime, index, array) => {
            if(array[index - 1]?.mal_id != anime?.mal_id){
                return (
                    <SwiperSlide
            key={index}
            style={{ width: '195px', height: '40svh' }} // or use fixed or dynamic width based on screen
            className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
            >
            <div className="relative h-full overflow-hidden rounded-lg">
                {/* Image */}
                <div className="w-full bg-red-100 h-full rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                <img
                    src={anime?.images?.webp.large_image_url}
                    alt={anime?.title}
                    className="w-full h-full object-cover brightness-70"
                />
                </div>
    
                {/* Info */}
                <div className="w-full absolute px-3 py-1 bottom-0 bg-transparent backdrop-blur h-[20%] sm:h-[25%] md:h-[20%] rounded-b-lg flex">
                <div className="flex flex-col items-start w-full h-full justify-around">
                    <h2 className="text-white text-sm md:text-base truncate w-full">
                    {anime?.title_english?.replace(/;/g, ' ') || anime?.title?.replace(/;/g, ' ')}
                    </h2>
                    <h2 className="text-gray-300 text-sm md:text-sm">
                    {anime?.year || 'N/A'} {anime?.genres[0]?.name}
                    </h2>
                </div>
                </div>
            </div>
            </SwiperSlide>
                )
            }
        })}
        </Swiper>
        </div>
    </div>
  )
}

export default UpcomingAnime