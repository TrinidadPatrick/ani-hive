import React, { memo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useUpcomingAnime } from "../../hooks/useUpcomingAnime";
import slugify from "slugify";

const UpcomingAnime = memo(({ handleSetScrollPosition }) => {
  const navigate = useNavigate();
  const { data: upcomingAnime, isLoading } = useUpcomingAnime();
  const [hovered, setHovered] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  console.log(upcomingAnime)

  return (
    <main id="upcoming">
      {isLoading && !upcomingAnime ? (
        <section className="flex flex-col px-6 py-8 text-white animate-pulse">
          {/* Title */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="h-6 w-40 bg-gray-700 rounded" />
              <div className="h-3 w-64 bg-gray-700 rounded mt-2" />
            </div>
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>

          {/* Carousel skeleton */}
          <div className="flex gap-4 overflow-x-auto mx-auto">
            {Array.from({ length: 9 }).map((_, idx) => (
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
        <section className="w-full h-fit bg-themeExtraDarkBlue py-10">
          <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3 flex items-center gap-2">
            <div className="w-1 h-13 bg-pink-600" />
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Upcoming Anime
              </h1>
              <p className="text-gray-400 text-sm md:text-base ">
                Anticipated upcoming anime
              </p>
            </div>
          </div>

          <div className="relative p-2 md:p-0">
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
              spaceBetween={10}
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
                  slidesPerView: 2,
                  slidesPerGroup: 2,
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
                1024: {
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
                { upcomingAnime?.data?.length > 0 &&
                upcomingAnime.data.map((anime, index, array) => {
                  if (array[index - 1]?.mal_id !== anime?.mal_id) {
                    return (
                      <SwiperSlide
                        key={index}
                        style={{ width: "195px", height: "auto" }}
                        className="h-full md:h-fit px-0 flex items-center justify-center rounded-lg cursor-pointer"
                      >
                        <motion.div
                          key={anime.mal_id}
                          layout="position"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index % 10) * 0.05 }}
                        >
                          <div
                            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(-1)}
                          >
                            <div className="aspect-[3/4] overflow-hidden">
                              <img
                                src={
                                  anime?.images?.jpg?.large_image_url ||
                                  anime?.images?.webp?.large_image_url
                                }
                                alt={anime?.title_english || anime?.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />

                              <div
                                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${hovered === index
                                    ? "opacity-100"
                                    : "opacity-70"
                                  }`}
                              />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 px-2 pb-4 sm:p-6 text-white">
                              <div
                                className={`transition-all duration-300 ${hovered === index
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-90"
                                  }`}
                              >
                                <h3 className={`text-xs xs:text-sm sm:text-[0.9rem] md:text-base 2xl:text-base font-bold mb-2 ${hovered === index ? 'line-clamp-5' : 'line-clamp-2'} leading-4 group-hover:text-pink-400 transition-colors`}>
                                  {anime?.title_english?.replace(/;/g, " ") ||
                                    anime?.title?.replace(/;/g, " ")}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <svg
                                    className="h-3 w-3 sm:w-4 sm:h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    />
                                  </svg>

                                  <span className="text-xs sm:text-sm lg:text-base">
                                    {anime?.year || "TBA"}{" "}
                                    {anime?.genres?.[0]?.name
                                      ? `- ${anime.genres[0].name}`
                                      : ""}
                                  </span>
                                </div>
                              </div>

                              {hovered === index && (
                                <button
                                  onClick={() => {
                                    handleSetScrollPosition();
                                    navigate(
                                      `/anime/${anime?.mal_id}?title=${slugify(
                                        anime?.title || "",
                                      )}`,
                                    );
                                  }}
                                  className="cursor-pointer mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                  View Details
                                </button>
                              )}
                            </div>

                            {anime?.score && (
                              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                                <Star
                                  className="fill-amber-500 text-amber-500"
                                  width={13}
                                />
                                {anime?.score}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    );
                  }
                })
              }
                        </Swiper>
        </div>
        </section>
  )
}
    </main >
  );
})

export default UpcomingAnime;
