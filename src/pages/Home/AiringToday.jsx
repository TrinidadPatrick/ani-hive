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

          <div className="w-[90%] h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-10">
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
                        onClick={() => {
                          navigate(
                            `/anime/${anime?.mal_id}?title=${slugify(
                              anime?.title || "",
                            )}`,
                          );
                          handleSetScrollPosition();
                        }}
                        className="group relative overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(-1)}
                      >
                        {/* Image Container */}
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl relative border border-gray-800">
                          <img
                            src={
                              anime?.images?.jpg?.large_image_url ||
                              anime?.images?.webp?.large_image_url
                            }
                            alt={anime?.title_english || anime?.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Backdrop */}
                          <div
                            className={`absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
                              hovered === index ? "opacity-100" : "opacity-90"
                            }`}
                          />

                          {/* Year and status */}
                          <div className="absolute bottom-0 left-0 right-0 pb-4 sm:p-3 text-white">
                            <div
                              className={`transition-all duration-300 ${
                                hovered === index
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-2 opacity-90"
                              }`}
                            >
                              <div className="flex items-center gap-2 p-1 text-gray-300 jakarta">
                                <span className="text-xs">
                                  {anime?.aired?.string || "TBA"}
                                </span>
                              </div>
                            </div>
                          </div>
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

                        {/* Title & Genre */}
                        <div className="flex flex-col mt-3 text-white">
                          <h3 className="text-white font-medium text-start text-sm md:text-[0.9rem] mt-1 w-full leading-5 line-clamp-2 overflow-hidden max-h-5 group-hover:max-h-10 transition-[max-height] duration-300 ease-out">
                              {anime?.title?.english || anime?.title?.romaji}
                            {anime?.title_english?.replace(/;/g, " ") ||
                              anime?.title?.replace(/;/g, " ")}
                          </h3>
                          <span className="text-xs text-white/50 font-light jakarta">
                            {anime?.genres
                              ?.slice(0, 2)
                              .map((genre) => genre.name)
                              .join(" • ")}
                          </span>
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
