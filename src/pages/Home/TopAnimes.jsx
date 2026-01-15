import React, { useEffect, useRef } from 'react';
import TopAnimeProvider from '../../providers/TopAnimeProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TopAnimes = ({ topAnimes, handleSetScrollPosition }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  return (
    <main id="top-animes">
      {topAnimes == null ? (
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
              <div
                key={idx}
                className="min-w-[150px] w-[150px] flex-shrink-0 space-y-2"
              >
                <div className="aspect-[2/3] bg-gray-700 rounded-lg" />
                <div className="h-3 w-32 bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full h-full md:h-[65svh] bg-themeDarkest py-10">
          <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Top Rated Anime
            </h1>

            <div className="flex justify-between">
              <p className="text-gray-400 mt-1 text-sm md:text-base ">
                Explore the highest-rated anime of all time
              </p>

              <button
                data-aos="fade-left"
                onClick={() => {
                  handleSetScrollPosition();
                  navigate(
                    '/explore?page=1&order_by=score&sort_by=desc'
                  );
                }}
                className="text-sm md:text-base text-white cursor-pointer hover:text-gray-300"
              >
                See all
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              ref={prevRef}
              className="cursor-pointer hover:text-gray-400 swiper-button-prev-custom hidden lg:block absolute left-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2"
            >
              ◀
            </button>

            <button
              ref={nextRef}
              className="cursor-pointer hover:text-gray-400 swiper-button-next-custom hidden lg:block absolute right-5 z-10 top-1/2 -translate-y-1/2 text-white text-2xl px-2"
            >
              ▶
            </button>

            <Swiper
              modules={[FreeMode, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              grabCursor
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
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                },
                430: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                },
                630: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                769: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                890: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
                1280: {
                  slidesPerView: 6,
                  slidesPerGroup: 6,
                },
              }}
              className="w-[95%] md:w-[90%] mx-auto"
            >
              {topAnimes?.data?.length > 0 &&
                topAnimes.data.map((anime, index, array) => {
                  if (array[index - 1]?.mal_id !== anime?.mal_id) {
                    return (
                      <SwiperSlide
                        key={index}
                        style={{ width: '195px', height: '40svh' }}
                        className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
                      >
                        <motion.div
                          key={anime.id}
                          layout="position"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: (index % 10) * 0.05,
                          }}
                        >
                          <div
                            onClick={() => {
                              handleSetScrollPosition();
                              navigate(
                                `/anime/${anime?.mal_id}?title=${
                                  anime?.title || ''
                                }`
                              );
                            }}
                            className="relative h-full overflow-hidden rounded-lg"
                          >
                            {/* Rating */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1 z-90">
                              <Star
                                className="fill-amber-500 text-amber-500"
                                width={13}
                              />
                              {anime?.score || '0'}
                            </div>

                            {/* Image */}
                            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                              <img
                                src={
                                  anime?.images?.webp
                                    .large_image_url
                                }
                                alt={anime?.title}
                                className="w-full h-full object-cover brightness-70"
                              />
                            </div>

                            {/* Info */}
                            <div className="w-full absolute px-3 py-1 bottom-0 bg-transparent backdrop-blur h-fit rounded-b-lg flex">
                              <div className="flex flex-col items-start w-full h-full justify-around">
                                <h2 className="text-white text-lg sm:text-sm md:text-base truncate w-full">
                                  {anime?.title_english?.replace(
                                    /;/g,
                                    ' '
                                  ) ||
                                    anime?.title_english?.replace(
                                      /;/g,
                                      ' '
                                    )}
                                </h2>

                                <h2 className="text-gray-300 text-sm md:text-sm">
                                  {anime?.year}{' '}
                                  {anime?.genres[0]?.name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    );
                  }
                })}
            </Swiper>
          </div>
        </section>
      )}
    </main>
  );
};

export default TopAnimes;
