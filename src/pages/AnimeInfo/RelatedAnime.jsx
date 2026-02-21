import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import AnimeRelatedSkeleton from './skeleton/AnimeRelatedSkeleton';
import usePublicAnimeInfo from '../../stores/PublicAnimeInfoStore';
import useScrollPosition from '../../stores/ScrollPositionStore';

const RelatedAnime = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const animeRelations = usePublicAnimeInfo((s) => s.animeRelations);
    const setClickedRelatedId = useScrollPosition((s) => s.setClickedRelatedId);
    const clickedRelatedId = useScrollPosition((s) => s.clickedRelatedId);

    const itemRefs = useRef(new Map());

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

    useEffect(() => {
        if (clickedRelatedId == id || !clickedRelatedId) {
            setTimeout(() => {
                window.scrollTo({ top: 0 });
            }, 500);
        }
    }, [clickedRelatedId, id]);

    useEffect(() => {
        if (clickedRelatedId && animeRelations && animeRelations.length > 0) {
            setTimeout(() => {
                scrollToId(clickedRelatedId);
            }, 500);
        }
    }, [animeRelations, clickedRelatedId]);

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
                    animeRelations && animeRelations?.length !== 0 && (
                        <div className="relative w-full">
                            <div className="flex w-full overflow-x-auto gap-3 pb-2 snap-x hover-scrollbar">
                                {animeRelations.map((info, index) => {
                                    const relatedId = info.idMal || info.id;
                                    return (
                                        <div
                                            key={relatedId || index}
                                            ref={(node) => {
                                                if (node) {
                                                    itemRefs.current.set(relatedId, node);
                                                } else {
                                                    itemRefs.current.delete(relatedId);
                                                }
                                            }}
                                            onClick={() => {
                                                setClickedRelatedId(relatedId);
                                                navigate(`/anime/${info.idMal}?title=${info?.title.english || info?.title.romaji}`);
                                            }}
                                            className="w-[130px] sm:w-[135px] md:w-[180px] lg:w-[195px] shrink-0 snap-start h-full md:h-fit flex flex-col items-center justify-center rounded-lg cursor-pointer"
                                        >
                                            <div className="relative w-full h-fit overflow-hidden rounded-lg">
                                                <div className="absolute top-1 left-2 z-[999999999999] px-2 py-0.5 rounded-lg flex items-center justify-center gap-1">
                                                    <div className="bg-black opacity-55 absolute w-full h-full rounded-lg"></div>
                                                    <p className="text-white z-[9999999] text-sm md:text-[0.9rem]">
                                                        {info?.type}
                                                    </p>
                                                </div>

                                                {/* Image */}
                                                <div className="w-full h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                                                    <img
                                                        src={info?.coverImage.large}
                                                        alt={info?.title.english || info?.title.romaji}
                                                        className="w-full aspect-[2/2.8] object-cover brightness-70"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="w-full px-1 md:px-2 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[30%] rounded-b-lg flex">
                                                    <div className="flex flex-col items-start w-full h-full justify-around">
                                                        <h2 className="text-white text-sm md:text-[0.95rem] w-full line-clamp-3 text-center">
                                                            {info?.title.english || info?.title.romaji}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default RelatedAnime;