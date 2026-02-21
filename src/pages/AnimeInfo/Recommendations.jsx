import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useSmallScreen from '../../utils/useSmallScreen';
import AnimeRecommendationSkeleton from './skeleton/AnimeRecommendationSkeleton';
import { useNavigate, useSearchParams } from 'react-router-dom'
import usePublicAnimeInfo from '../../stores/PublicAnimeInfoStore';
import useScrollPosition from '../../stores/ScrollPositionStore';

const Recommendations = React.memo(({ title }) => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const recommendations = usePublicAnimeInfo((s) => s.recommendations)
    const setRecommendations = usePublicAnimeInfo((s) => s.setRecommendations)
    const setAnimeRelations = usePublicAnimeInfo((s) => s.setAnimeRelations)
    const setClickedRecommendationId = useScrollPosition((s) => s.setClickedRecommendationId)
    const clickedRecommendationId = useScrollPosition((s) => s.clickedRecommendationId)
    const itemRefs = useRef(new Map())

    const animeTitle = searchParams.get('title')

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

    const getRecommendations = async (searchTerm) => {
        const query = `
        query ($search: String) {
            Media(search: $search, type: ANIME) {
            id
            recommendations(sort: RATING_DESC, perPage: 20) {
                nodes {
                mediaRecommendation {
                    id
                    idMal
                    title {
                    romaji
                    english
                    }
                    coverImage {
                    large
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
                relations {
                nodes {
                    id
                    idMal
                    title {
                    english
                    native
                    romaji
                    }
                    coverImage {
                    large
                    }
                    type
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
            const relatedAnimes = media.relations.nodes.filter((result) => result.type === "ANIME" && result.idMal)
            const recommendedAnimes = media.recommendations.nodes
            setRecommendations(recommendedAnimes || []);
            setAnimeRelations(relatedAnimes || []);
        } catch (err) {
            setRecommendations([])
            setAnimeRelations([])
            console.log(err);
        }

    }

    useEffect(() => {
        if (animeTitle) {
            getRecommendations(animeTitle)
        } else if (!animeTitle && title) {
            getRecommendations(title)
        }
    }, [title])

    useEffect(() => {
        if (clickedRecommendationId && recommendations && recommendations.length > 0) {
            setTimeout(() => {
                scrollToId(clickedRecommendationId)
            }, 500)
        }
    }, [recommendations, clickedRecommendationId])


    return (
        <div className='scrollbar xl:col-span-3 hidden xl:flex h-fit pb-5 overflow-auto mt-20 flex-col gap-3 z-90 relative'>
            <div>
                <h1 className='text-white text-2xl font-bold'>Recommendations</h1>
            </div>
            {
                recommendations === null ?
                    (
                        <AnimeRecommendationSkeleton />
                    )
                    :
                    recommendations && recommendations?.length !== 0 ?
                        recommendations?.map((recommendation, index, array) => {
                            if (recommendation?.mediaRecommendation) {
                                return (
                                    <div 
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
                                        key={recommendation.mediaRecommendation.idMal} 
                                        className='w-full hover:bg-[#212121] flex gap-2 cursor-pointer'
                                    >
                                        <div className='w-[90px] aspect-[2/2.3] flex-none'>
                                            <img src={recommendation?.mediaRecommendation?.coverImage?.large} alt={recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji} className='w-full h-full object-cover rounded-lg' />
                                        </div>
                                        <div className='flex flex-col justify-between py-1'>
                                            <div>
                                                <h2 className='text-white font-medium text-sm md:text-[0.9rem] line-clamp-2'>{recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji}</h2>
                                                <p className='text-gray-300 text-sm'>Ep {recommendation?.mediaRecommendation?.nextAiringEpisode?.episode || recommendation?.mediaRecommendation?.episodes}/{recommendation?.mediaRecommendation?.episodes}</p>
                                            </div>
                                            <p className='text-gray-300 text-sm'>{recommendation?.mediaRecommendation?.genres?.join(', ')}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        :
                        recommendations && recommendations?.length === 0 &&
                        (
                            <div className='w-full h-full flex justify-center items-center '>
                                <h1 className='text-gray-400 text-2xl'>No Recommendations</h1>
                            </div>
                        )
            }
        </div>
    )
})

export default Recommendations