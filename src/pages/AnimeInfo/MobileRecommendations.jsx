import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useSmallScreen from '../../utils/useSmallScreen';
import AnimeRecommendationSkeleton from './skeleton/AnimeRecommendationSkeleton';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicAnimeInfo from '../../stores/PublicAnimeInfoStore';
import useScrollPosition from '../../stores/ScrollPositionStore';

const MobileRecommendations = React.memo(({ title }) => {
    const {id} = useParams()
    const navigate = useNavigate()
    const recommendations = usePublicAnimeInfo((s) => s.recommendations)
    const setClickedRecommendationId = useScrollPosition((s) => s.setClickedRecommendationId)
    const clickedRecommendationId = useScrollPosition((s) => s.clickedRecommendationId)
    const itemRefs = useRef(new Map())

    const scrollToId = (itemId) => {
        const map = itemRefs.current;
        const node = map.get(itemId);
        if (node) {
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    useEffect(()=>{
        if(clickedRecommendationId == id || !clickedRecommendationId){
            setTimeout(()=>{
            window.scrollTo({top: 0})
            }, 500)
        }
    }, [clickedRecommendationId, id])

    useEffect(() => {
        if (clickedRecommendationId && recommendations && recommendations.length > 0) {
            setTimeout(() => {
                scrollToId(clickedRecommendationId)
            }, 500)
        }
    }, [recommendations, clickedRecommendationId])

    return (
        <div className="w-full flex flex-col gap-3 xl:hidden max-h-[370px]  ">
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
                    <div className="relative w-full">
                        <div className="flex w-full overflow-x-auto gap-3 pb-4 snap-x hover-scrollbar">
                            {recommendations.length > 0 &&
                                recommendations.map((recommendation, index, array) => {
                                    if (1 === 1) {
                                        return (
                                            <div
                                                key={recommendation.mediaRecommendation.idMal}
                                                ref={(node) => {
                                                    if (node) {
                                                        itemRefs.current.set(recommendation.mediaRecommendation.idMal, node);
                                                    } else {
                                                        itemRefs.current.delete(recommendation.mediaRecommendation.idMal);
                                                    }
                                                }}
                                                onClick={() => {
                                                    setClickedRecommendationId(recommendation.mediaRecommendation.idMal)
                                                    navigate(`/anime/${recommendation.mediaRecommendation.idMal}?title=${recommendation.mediaRecommendation.title.romaji}`)
                                                }}
                                                className="w-[130px] sm:w-[150px] md:w-[180px] lg:w-[195px] shrink-0 snap-start h-fit px-0 flex flex-col items-center justify-center rounded-lg cursor-pointer"
                                            >
                                                <div className="relative w-full h-fit overflow-hidden rounded-lg">
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
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                    </div>
                )
            }
        </div>
    )
})

export default MobileRecommendations