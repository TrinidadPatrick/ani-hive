import React, { useEffect, useRef } from 'react'
import TopAnimeProvider from '../../Providers/TopAnimeProvider'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

const TopAnimes = ({topAnimes}) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const navigate = useNavigate()

    // useEffect(()=>{
    //   AOS.init();
    // }, [])


  return (
    <>
      {
        topAnimes == null ?
        (
          <section className="px-6 py-8 text-white animate-pulse">
      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-6 w-40 bg-gray-700 rounded" />
          <div className="h-3 w-64 bg-gray-700 rounded mt-2" />
        </div>
        <div className="h-4 w-16 bg-gray-700 rounded" />
      </div>

      {/* Carousel skeleton */}
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx} className="min-w-[150px] w-[150px] flex-shrink-0 space-y-2">
            <div className="aspect-[2/3] bg-gray-700 rounded-lg" />
            <div className="h-3 w-32 bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
          </section>
        )
        :
        (
        <section className="w-full h-full md:h-[65svh] bg-[#141414] py-10">
        <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3">
          <h1  className="text-2xl md:text-3xl font-bold text-white">Top Rated Anime</h1>
          <div className='flex justify-between'>
              <p  className="text-gray-400 mt-1 text-sm md:text-basetext-white">Explore the highest-rated anime of all time</p>
              <button data-aos="fade-left" onClick={()=>navigate('/explore?page=1')} className='text-sm md:text-base text-white cursor-pointer hover:text-gray-300'>See all</button>
          </div>
          
        </div>
        <div  className=' relative'>
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
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
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
        className="w-[95%] md:w-[90%] mx-auto "
      >
        {topAnimes?.data?.length > 0 &&
          topAnimes.data.map((anime, index, array) =>
          {
            if(array[index - 1]?.mal_id != anime?.mal_id){
              return (
                <SwiperSlide
              key={index}
              style={{ width: '195px', height: '40svh' }} // or use fixed or dynamic width based on screen
              className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
            >
              <div onClick={()=>navigate(`/anime/${anime?.mal_id}`)} className="relative h-full overflow-hidden rounded-lg">
                {/* Rating */}
                <div className="w-fit flex items-center absolute z-[999] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-1">
                  <div className="w-full h-full bg-black opacity-55 absolute left-0 top-0"></div>
                  <svg
                    className="z-[9999]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="orange"
                      d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
                    />
                  </svg>
                  <p className="z-[9999] mt-[1px]">{anime?.score}</p>
                </div>

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
                      {anime?.title_english?.replace(/;/g, ' ') || anime?.title_english?.replace(/;/g, ' ')}
                    </h2>
                    <h2 className="text-gray-300 text-sm md:text-sm">
                      {anime?.year} {anime?.genres[0]?.name}
                    </h2>
                  </div>
                </div>
              </div>
            </SwiperSlide>
              )
            }})
          }
          
      </Swiper>
        </div>
        </section>
        )
      }
      
    </>
  )
}

export default TopAnimes