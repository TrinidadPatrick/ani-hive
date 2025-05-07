import React, { useEffect } from 'react'
import TopAnimeProvider from '../../Providers/TopAnimeProvider'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';

const TopAnimes = () => {
    const {topAnimes} = TopAnimeProvider()

    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 1280 },
          items: 7
        },
        largeDesktop: {
            breakpoint: { max: 1279, min: 890 },
            items: 5
          },
        desktop: {
          breakpoint: { max: 889, min: 769 },
          items: 4
        },
        tablet: {
          breakpoint: { max: 768, min: 630 },
          items: 4
        },
        semi_tablet: {
            breakpoint: { max: 629, min: 481 },
            items: 3
          },
        mobile: {
          breakpoint: { max: 480, min: 0 },
          items: 2,
          slidesToSlide: 2,
        }
      };

    console.log(topAnimes)

  return (
    <div className="w-full bg-[#141414] py-10">
  <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3">
    <h1 className="text-2xl md:text-3xl font-bold text-white">Top Rated Anime</h1>
    <div className='flex justify-between'>
        <p className="text-gray-400 mt-1 text-sm md:text-basetext-white">Explore the highest-rated anime of all time</p>
        <button className='text-sm md:text-base text-white'>See all</button>
    </div>
    
  </div>
  <div className=' relative'>
        <button className=" cursor-pointer hover:text-gray-400 swiper-button-prev-custom hidden lg:block absolute left-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2">
        ◀
        </button>
        <button className=" cursor-pointer hover:text-gray-400 swiper-button-next-custom hidden lg:block absolute right-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2">
            ▶
        </button>
  <Swiper
  modules={[FreeMode, Navigation]}
  freeMode={true}
  spaceBetween={20}
  slidesPerView={2}
  grabCursor={true}
  navigation={{
    nextEl: '.swiper-button-next-custom',
    prevEl: '.swiper-button-prev-custom',
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
    topAnimes.data.map((anime, index) => (
      <SwiperSlide
        key={index}
        style={{ width: '195px', height: '40svh' }} // or use fixed or dynamic width based on screen
        className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
      >
        <div className="relative h-full overflow-hidden rounded-lg">
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
              className="w-full h-full object-cover brightness-90"
            />
          </div>

          {/* Info */}
          <div className="w-full absolute px-3 py-1 bottom-0 bg-transparent backdrop-blur h-[20%] sm:h-[25%] md:h-[20%] rounded-b-lg flex">
            <div className="flex flex-col items-start w-full h-full justify-around">
              <h2 className="text-white text-sm md:text-base truncate w-full">
                {anime?.title_english?.replace(/;/g, ' ') || anime?.title?.replace(/;/g, ' ')}
              </h2>
              <h2 className="text-gray-300 text-sm md:text-sm">
                {anime?.year} {anime?.genres[0]?.name}
              </h2>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}
</Swiper>
</div>
</div>

  )
}

export default TopAnimes