import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useSmallScreen from '../../utils/useSmallScreen';
import AnimeRecommendationSkeleton from './skeleton/AnimeRecommendationSkeleton';
import {useSearchParams} from 'react-router-dom'

const Recommendations = React.memo(({title}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [recommendations, setRecommendations] = useState(null);

    const animeTitle = searchParams.get('title')

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const getRecommendations = async (searchTerm) => {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          recommendations(sort: RATING_DESC, perPage: 10) {
            nodes {
              mediaRecommendation {
                id
                idMal
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                }
                nextAiringEpisode {
                    episode
                    airingAt
                  }
                  genres
                episodes
              }
            }
          }
        }
      }
    `;

    const variables = { search: searchTerm };

    try {
        const { data } = await axios.post(
          'https://graphql.anilist.co',
          { query, variables },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const media = data.data.Media;
        setRecommendations(media.recommendations.nodes);
      } catch (err) {
        setRecommendations([])
        console.log(err);
    }

    }

    useEffect(() => {
        if(animeTitle){
            getRecommendations(animeTitle)
        }else{
            getRecommendations(title)
        }
        console.log(animeTitle)
    }, [title])

    

    return (
    <div className="w-full flex xl:hidden flex-col gap-3">
        <div>
            <h1 className="text-white text-xl md:text-2xl font-bold">
            Recommendations
            </h1>
        </div>

        {recommendations === null && <AnimeRecommendationSkeleton />}

        {recommendations && recommendations?.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-gray-400 text-2xl">No Recommendations</h1>
            </div>
        ) : (
            recommendations &&
            recommendations?.length !== 0 && (
            <div className="relative">
                <Swiper
                modules={[FreeMode, Navigation]}
                freeMode={true}
                spaceBetween={20}
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
                    // animeRelations;
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
                {recommendations.length > 0 &&
                    recommendations.map((recommendation, index, array) => {
                    if (1 === 1) {
                        return (
                        <SwiperSlide
                            key={index}
                            onClick={() =>
                            (window.location.href = `/anime/${recommendation.mediaRecommendation.id}?name=${recommendation.mediaRecommendation.title.romaji}`)
                            }
                            style={{ width: "195px", height: "40svh" }}
                            className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
                        >
                            <div className="relative h-fit overflow-hidden rounded-lg">
                            <div className="absolute top-1 left-2 z-[999999999999] px-2 py-0.5 rounded-lg flex items-center justify-center gap-1">
                                <div className="bg-black opacity-55 absolute w-full h-full rounded-lg"></div>
                                <p className="text-white z-[9999999] text-sm">
                                {recommendation?.mediaRecommendation
                                    ?.nextAiringEpisode?.episode ||
                                    recommendation?.mediaRecommendation?.episodes}
                                /
                                {recommendation?.mediaRecommendation?.episodes}
                                </p>
                            </div>

                            {/* Image */}
                            <div className="w-full h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                                <img
                                src={
                                    recommendation?.mediaRecommendation?.coverImage
                                    ?.large
                                }
                                alt={
                                    recommendation?.mediaRecommendation?.title
                                    ?.english ||
                                    recommendation?.mediaRecommendation?.title?.romaji
                                }
                                className="w-full aspect-[2/2.8] object-cover brightness-70"
                                />
                            </div>

                            {/* Info */}
                            <div className="w-full px-1 md:px-2 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[30%] rounded-b-lg flex">
                                <div className="flex flex-col items-start w-full h-full justify-around">
                                <h2 className="text-white text-sm md:text-sm w-full line-clamp-3 text-center">
                                    {recommendation?.mediaRecommendation?.title
                                    ?.english ||
                                    recommendation?.mediaRecommendation?.title
                                        ?.romaji}
                                </h2>
                                </div>
                            </div>
                            </div>
                        </SwiperSlide>
                        );
                    }
                    })}
                </Swiper>
            </div>
            )
        )}
    </div>

  )
})

export default Recommendations