import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAiringToday } from "../../hooks/useAiringToday";
import slugify from "slugify";

const AiringToday = ({ handleSetScrollPosition }) => {
  const [hovered, setHovered] = useState(false);
  const { data: airingToday, isLoading } = useAiringToday();
  const navigate = useNavigate();

  return (
    <main id="airing-today">
      {isLoading && !airingToday ? (
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-white">Airing Today</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse gap-4 items-center"
              >
                <div className="w-36 h-24 bg-gray-700 rounded"></div>

                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
                  <div className="h-2 bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-2 bg-pink-500 rounded-full w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section className="w-full h-fit flex flex-col items-center justify-center bg-themeExtraDarkBlue py-10">
          <div className="w-[95%] md:w-[90%] mx-auto mb-6 px-3 flex items-center gap-2">
            <div className="w-1 h-13 bg-pink-600" />
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Airing Today
              </h1>
              <p className="text-gray-400 text-sm md:text-base ">
                Animes currently or will be airing today
              </p>
            </div>
          </div>

          <div className="w-[90%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {airingToday?.length > 0 &&
              airingToday.map((anime, index) => {
                if (1 == 1) {
                  return (
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
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={anime?.images?.jpg?.large_image_url}
                            alt={anime?.title_english || anime?.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          <div
                            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                              hovered === index ? "opacity-100" : "opacity-70"
                            }`}
                          />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div
                            className={`transition-all duration-300 ${
                              hovered === index
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-90"
                            }`}
                          >
                            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                              {anime?.title_english || anime?.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                />
                              </svg>

                              <span>{anime?.aired?.string || "TBA"}</span>
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

                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                          <Star
                            className="fill-amber-500 text-amber-500"
                            width={13}
                          />
                          {anime?.score || "0"}
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              })}
          </div>
        </section>
      )}
    </main>
  );
};

export default AiringToday;
