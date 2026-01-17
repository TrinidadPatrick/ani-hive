import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {useNavigate, useSearchParams} from 'react-router-dom'
import AnimeRelatedSkeleton from './skeleton/AnimeRelatedSkeleton';
import usePublicAnimeInfo from '../../stores/PublicAnimeInfoStore';

const RelatedAnime = () => {
    const navigate = useNavigate()
    const animeRelations = usePublicAnimeInfo((s) => s.animeRelations)

    const prevRef = useRef(null);
    const nextRef = useRef(null);
        
    return (
    <div className="w-full flex flex-col gap-3">
        <div>
            <h1 className="text-white text-xl md:text-2xl font-bold">Related</h1>
        </div>

        {animeRelations && animeRelations?.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-gray-500 text-2xl">No Related Anime</h1>
            </div>
        )}

        <div className="relative">
            {!animeRelations ? (
            <AnimeRelatedSkeleton />
            ) : (
            animeRelations &&
            animeRelations?.length !== 0 && (
                <Swiper
                modules={[FreeMode, Navigation]}
                // freeMode={true}
                spaceBetween={10}
                slidesPerView={2}
                slidesPerGroup={1}
                grabCursor={true}
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
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    },
                    481: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    },
                    630: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    },
                    769: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    },
                    890: {
                    slidesPerView: 6,
                    slidesPerGroup: 6,
                    },
                    1280: {
                    slidesPerView: 7,
                    slidesPerGroup: 7,
                    },
                }}
                className="w-full mx-auto"
                >
                {animeRelations &&
                    animeRelations?.length > 0 &&
                    animeRelations.map((info, index, array) => {
                    if (1 === 1) {
                        return (
                        <SwiperSlide
                            key={index}
                            onClick={() => {
                            navigate(`/anime/${info.idMal}?title=${info?.title.english || info?.title.romaji}`);
                            }}
                            style={{ width: "195px", height: "auto" }}
                            className="h-full md:h-[40svh] flex items-center justify-center rounded-lg cursor-pointer"
                        >
                            <div className="relative h-fit overflow-hidden rounded-lg">
                            <div className="absolute top-1 left-2 z-[999999999999] px-2 py-0.5 rounded-lg flex items-center justify-center gap-1">
                                <div className="bg-black opacity-55 absolute w-full h-full rounded-lg"></div>
                                <p className="text-white z-[9999999] text-sm">
                                {info?.type}
                                </p>
                            </div>

                            {/* Image */}
                            <div className="w-full h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                                <img
                                src={info?.coverImage.large}
                                alt={
                                    info?.title.english || info?.title.romaji
                                }
                                className="w-full aspect-[2/2.8] object-cover brightness-70"
                                />
                            </div>

                            {/* Info */}
                            <div className="w-full px-1 md:px-2 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[30%] rounded-b-lg flex">
                                <div className="flex flex-col items-start w-full h-full justify-around">
                                <h2 className="text-white text-sm md:text-sm w-full line-clamp-3 text-center">
                                    {info?.title.english || info?.title.romaji}
                                </h2>
                                </div>
                            </div>
                            </div>
                        </SwiperSlide>
                        );
                    }
                    })}
                </Swiper>
            )
            )}
        </div>
    </div>

  )
}

export default RelatedAnime