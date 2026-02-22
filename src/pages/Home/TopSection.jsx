import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import image_1 from "../../images/image_2.jpeg";
import { useNavigate } from "react-router";
import ReactPlayer from "react-player";
import useSmallScreen from "../../utils/useSmallScreen";
import getYoutubeId from "../../utils/getYoutubeId";
import TrailerPlayer from "../../components/TrailerPlayer";
import {
  ArrowUpRight,
  Calendar,
  Film,
  Play,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { useTopAnimes } from "../../hooks/useTopAnimes.js";
import slugify from "slugify";

const TopSection = () => {
  const { data: topAnimes } = useTopAnimes();
  const isSmallScreen = useSmallScreen();
  const [topAnime, setTopAnime] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (topAnimes?.data?.length > 0) {
      setTopAnime(topAnimes.data[0]);
      const youtubeId = getYoutubeId(topAnimes.data[0]?.trailer.embed_url);
      setYoutubeId(youtubeId);
    }
  }, [topAnimes]);

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTrailer]);

  return (
    <main id="top">
      {topAnime == null ? (
        <section className="relative lg:h-[100svh] flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 bg-gradient-to-r from-black via-transparent to-black text-white animate-pulse">
          {/* Left content skeleton */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-10 w-3/4 bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-700 rounded" />
              <div className="h-3 w-11/12 bg-gray-700 rounded" />
              <div className="h-3 w-10/12 bg-gray-700 rounded" />
              <div className="h-3 w-9/12 bg-gray-700 rounded" />
              <div className="h-3 w-8/12 bg-gray-700 rounded" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="h-3 w-24 bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-700 rounded" />
              <div className="h-3 w-28 bg-gray-700 rounded" />
              <div className="h-3 w-32 bg-gray-700 rounded" />
            </div>

            <div className="flex gap-4 pt-6">
              <div className="h-10 w-28 bg-gray-700 rounded-full" />
              <div className="h-10 w-32 bg-gray-700 rounded-full" />
            </div>
          </div>

          {/* Poster skeleton */}
          <div className="w-[1/2] lg:w-1/4 mt-10 lg:mt-0">
            <div className="w-full aspect-[3/4] bg-gray-700 rounded-2xl shadow-lg" />
          </div>
        </section>
      ) : (
        <section className="w-full md:h-[100svh] bg-themeExtraDarkBlue relative overflow-hidden flex items-center justify-center lg:px-6">
          {showTrailer && (
            <TrailerPlayer
              youtubeId={youtubeId}
              setShowTrailer={setShowTrailer}
            />
          )}
          {/* Background Image */}
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={topAnime?.images?.webp.large_image_url}
            alt={topAnime?.title}
            className="absolute w-full h-full object-cover brightness-50"
          />

          {/* Overlay (blur + tint) */}
          <div className="absolute inset-0 bg-themeExtraDarkBlue/80 backdrop-blur-xs" />
          <div className="relative mx-3 sm:mx-10 xl:mx-0 z-10 flex flex-col-reverse md:flex-row items-center gap-10 w-full max-w-7xl">
            {/* Left Side: Anime Info */}
            <div className="flex-1 space-y-0 p-3 md:p-0 z-10 w-full">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-fit border border-pink-500/30 bg-pink-500/10 rounded-full px-3 py-1.5 flex items-center gap-2 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-pink-400 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                  #1 Anime Of All Time
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col mb-4"
              >
                {(() => {
                  const title = topAnime?.title || "";
                  const parts = title.split(" ");
                  const isSingleWord = parts.length === 1;
                  const lastWord = isSingleWord ? "" : parts.pop();
                  const firstPart = isSingleWord ? title : parts.join(" ");

                  return (
                    <h1 className="text-5xl md:text-5xl lg:text-[4rem] font-serif font-bold leading-[1.1] tracking-tight">
                      <span className="text-white block">{title}</span>
                    </h1>
                  );
                })()}
              </motion.div>

              {/* Subtitle / English Title */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-400/80 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase mb-8"
              >
                {topAnime?.title_english || topAnime?.title}
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-4 sm:gap-6 text-gray-300 text-sm font-medium mb-6"
              >
                <div className="flex gap-1.5 items-center">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-bold text-base">
                    {topAnime?.score?.toFixed(2) || topAnime?.score}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div className="flex gap-2 items-center text-gray-400">
                  <Film className="w-4 h-4" />
                  <span>{topAnime?.episodes} Episodes</span>
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <div className="flex gap-2 items-center text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {topAnime?.season
                      ? topAnime.season.charAt(0).toUpperCase() +
                        topAnime.season.slice(1)
                      : ""}{" "}
                    {topAnime?.year}
                  </span>
                </div>
              </motion.div>

              {/* Genres Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-2.5 mb-8"
              >
                {topAnime?.genres.map((genre, index) => (
                  <div
                    key={index}
                    className="text-xs sm:text-sm px-4 py-1.5 rounded-full bg-transparent border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 transition-colors"
                  >
                    {genre.name}
                  </div>
                ))}
              </motion.div>

              {/* Synopsis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative max-w-2xl mb-2"
              >
                <p
                  className={`text-gray-400/90 text-sm sm:text-base leading-relaxed ${!showMore ? "line-clamp-3 md:line-clamp-4" : ""}`}
                >
                  {topAnime?.synopsis?.replace("[Written by MAL Rewrite]", "")}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                onClick={() => {
                  setShowMore(!showMore);
                }}
                className="text-pink-400 text-sm font-medium flex items-center gap-1 hover:text-pink-300 transition-colors mb-10"
              >
                {showMore ? "- Show less" : "+ Read more"}
              </motion.button>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-center flex-wrap gap-4"
              >
                <button
                  onClick={() => {
                    navigate(
                      `/anime/${topAnime?.mal_id}?title=${slugify(
                        topAnime?.title || "",
                      )}`,
                    );
                  }}
                  className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all duration-300"
                >
                  <ArrowUpRight className="w-5 h-5 fill-current" />
                  Overview
                </button>
                <button
                  onClick={() => {
                    setShowTrailer(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-transparent border border-gray-600 hover:border-gray-400 hover:bg-gray-800/50 text-white font-semibold py-3.5 px-8 rounded-full transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  Trailer
                </button>
              </motion.div>
            </div>

            {/* Right Side: Anime Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex-1 w-full max-w-sm md:max-w-[300px] xl:max-w-[400px] mt-20 md:mt-0 md:ml-10"
            >
              <img
                src={topAnime?.images?.webp.large_image_url}
                alt={topAnime?.title}
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                }}
                className="w-full rounded-xl shadow-2xl hover:scale-105 cursor-pointer transition-all duration-500 ease-in-out transform brightness-75"
              />
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default TopSection;
