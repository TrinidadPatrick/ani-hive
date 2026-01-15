import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import 'video.js/dist/video-js.css';
import getYoutubeId from '../../utils/getYoutubeId.js';
import TrailerPlayer from '../../components/TrailerPlayer.jsx';
import useUserAnimeStore from '../../stores/UserAnimeStore.js';
import { ExternalLink, Play, Plus, Star, Trash2 } from 'lucide-react';
import StatusDrodown from '../../components/MalComponents/MalAnimeList/StatusDrodown.jsx';
import useAuthStore from '../../stores/AuthStore.js';
import LoaderV2 from '../../components/LoaderV2.jsx';
import Characters from './Characters.jsx';
import Recommendations from './Recommendations.jsx';
import RelatedAnime from './RelatedAnime.jsx';
import Reviews from './Reviews.jsx';
import MobileRecommendations from './MobileRecommendations.jsx';

const AnimeOverView = () => {
    const navigate = useNavigate()
    const authenticated = useAuthStore((s) => s.authenticated)
    const login = useAuthStore((s) => s.login)
    const isUpdating = useUserAnimeStore((s) => s.isUpdating)
    const isDeleting = useUserAnimeStore((s) => s.isDeleting)
    const checkIsSaved = useUserAnimeStore((s) => s.checkIsSaved)
    const updateAnime = useUserAnimeStore((s) => s.updateAnime)
    const deleteAnime = useUserAnimeStore((s) => s.deleteAnime)

    const {id} = useParams()
    const [selectedWatchStatus, setSelectedWatchStatus] = useState(null)
    const [animeUserStatus, setAnimeUserStatus] = useState(null)
    const [animeInfo, setAnimeInfo] = useState(null)
    const [reviews, setReviews] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false)
    const [youtubeId, setYoutubeId] = useState(null)
    
    const checkAnimeForUser = async (anime_id) => {
        const result = await checkIsSaved(anime_id)
        if(result && result.my_list_status){
            setAnimeUserStatus(result.my_list_status)
            setSelectedWatchStatus(result.my_list_status.status)
        }else{
            setAnimeUserStatus(null)
        }
    }

    const handleAction = async (status) => {
        console.log(status)
        if(authenticated === false){
            return login()
        }
        if(status){
            const result = await updateAnime({id, num_watched_episodes: 0, score: 0, status})
            return checkAnimeForUser(id)
        }
        window.location.href = `/user/anime-list/${selectedWatchStatus}?id=${id}`
    }

    const handleDeleteAnime = async (id) => {
        const shouldDelete = window.confirm(`Delete ${animeInfo?.title} ?`)
        if(shouldDelete){
            const result = await deleteAnime(id)
            if(result.status === 200){
                checkAnimeForUser(id)
            }
        }
    }

    const getAnimeInfo = async (mal_id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/full`)
                if(result.status === 200) {
                    const anime = result.data.data
                    setAnimeInfo(anime)

                }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getAnimeInfo(id, retries - 1)
                }, 1000)
            }
        }
    }

    const InfoRow = ({ label, children }) => (
        <li className="flex justify-start gap-2">
          <h1 className="text-gray-400  min-w-[100px] text-[0.8rem] lg:text-[0.9rem] font-medium w-25 ">{label}</h1>
          <h1 className="text-gray-200 line-clamp-1 text-[0.8rem] lg:text-[0.9rem] font-bold">{children}</h1>
        </li>
    );

    useEffect(() => {
        if (id) {
          (async () => {
            await checkAnimeForUser(id)
            await getAnimeInfo(id, 1);
          })();
        }
    }, [id]);

    useEffect(() => {
        if(animeInfo) {        
        const youtubeId = getYoutubeId(animeInfo?.trailer?.embed_url)
        setYoutubeId(youtubeId)
        }
    }, [animeInfo])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

  return (
  <main className='w-full grid grid-cols-13 h-fit relative overflow-hidden sm:p-3'>
    <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80)] z-0 brightness-60 opacity-70" aria-hidden="true"/>
    
    {showTrailer && <TrailerPlayer youtubeId={youtubeId} setShowTrailer={setShowTrailer} />}
    {
        animeInfo ?
        <div className='w-full col-span-13 xl:col-span-10 h-fit py-20 px-2 sm:px-5 flex flex-col gap-5 z-90'>

            {/* Top Section */}
            <div className='flex-none h-full flex flex-col sm:flex-row gap-2'>
                <div className='w-full aspect-square xs:aspect-auto sm:w-[220px] relative'>
                    <img src={animeInfo?.images?.jpg.large_image_url} alt={animeInfo?.title_english || animeInfo?.title} 
                    className='w-full h-full sm:h-full aspect-video object-cover object-center rounded-lg brightness-40 sm:brightness-100 blur-xs sm:blur-none' />
                    <img src={animeInfo?.images?.jpg.large_image_url} alt={animeInfo?.title_english || animeInfo?.title} 
                    className='w-40 object-cover object-center rounded-lg sm:hidden border border-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                </div>
                <div className='flex-1 h-full  flex flex-col gap-2 px-2'>
                    {/* Badges */}
                    <div className='w-full flex gap-2 my-1'>
                        <div style={{ backgroundImage: 'linear-gradient(135deg, #f59f0a33, #c47f081a)', border: '1px solid hsl(38 92% 50% / .3)' }} className='flex gap-2 items-center px-3 rounded-2xl'>
                            <Star width={15} className='text-[#f7b23b] fill-[#f7b23b]' />
                            <h1 className='text-[#f7b23b] text-[0.7rem] font-medium mt-0.5'>{animeInfo?.score || 0}</h1>
                        </div>
                        <div className='px-3 bg-themeLightDark rounded-2xl flex items-center'>
                            <h1 className='text-white text-[0.7rem] font-medium'>{animeInfo?.rating ? animeInfo?.rating.split(' - ')[0] : 'N/A'}</h1>
                        </div>
                        <div className='px-3 bg-themeLightDark rounded-2xl flex items-center'>
                            <h1 className='text-white text-[0.7rem] font-medium'>{animeInfo?.type}</h1>
                        </div>
                        <div className='px-3 bg-themeLightDark rounded-2xl flex items-center'>
                            <h1 className='text-white text-[0.7rem] font-medium'>#{animeInfo?.rank}</h1>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='w-full flex flex-col w gap-2 justify-between'>
                        <div className=''>
                        <h1 className='text-white text-2xl lg:text-4xl font-bold line-clamp-2'>{animeInfo?.title_english || animeInfo?.title}</h1>
                        </div>
                        <div className='flex gap-2 my-2 h-10 '>
                            <button onClick={()=>{setShowTrailer(true)}} className='flex flex-grow-1 sm:flex-grow-0 justify-center items-center gap-2 text-white whitespace-nowrap text-sm px-5 py-2 bg-themeDark rounded-lg font-medium cursor-pointer hover:bg-themeDarker'>
                                <Play width={16} />
                                Watch Trailer
                            </button>
                            {
                                animeUserStatus ? (
                                <button onClick={()=>handleAction()} className='bg-pink-600  flex-grow-1 sm:flex-grow-0 flex justify-center capitalize py-2 text-white text-sm h-full px-2 sm:px-5 items-center rounded-lg relative gap-2 cursor-pointer hover:bg-pink-500'>
                                <ExternalLink width={16} />
                                <span>{selectedWatchStatus.replaceAll("_", " ")}</span>
                                </button>
                                )
                                :
                                (
                                <button disabled={(authenticated === null)} onClick={()=>{handleAction('plan_to_watch')}} className='flex gap-2 text-white whitespace-nowrap text-xs md:text-sm w-37 justify-center items-center py-2 bg-pink-600 rounded-lg font-medium cursor-pointer hover:bg-pink-500'>
                                    {
                                        isUpdating ? (<LoaderV2 width={7} height={7} color={'bg-gray-100'} />) : (<div className='flex gap-2 items-center'><Plus width={17} />Add to library</div>)
                                    }
                                </button>
                                )
                            }
                            <button title='Remove from list' disabled={(authenticated === null)} onClick={()=>{handleDeleteAnime(id)}} className={`${animeUserStatus === null && 'hidden'} flex items-center justify-center text-white whitespace-nowrap text-xs md:text-base w-12 py-2 bg-pink-600 rounded-lg font-medium cursor-pointer hover:bg-pink-500`}>
                                {
                                    isDeleting ? (<LoaderV2 width={6} height={6} color={'bg-gray-100'} />) : <Trash2 width={19} />
                                }
                            </button>
                        </div>
                    </div>
                    
                    {/* Other informations */}
                    <div className='w-full h-full grid grid-cols-1 md:grid-cols-2 bg-themeDarker border border-themeLightDark rounded-lg p-3'>
                        <div className='h-full w-full'>

                        <ul className="h-full gap-3 flex flex-col justify-between">
                            <InfoRow label="Score:">
                                <span className='text-amber-500'>{animeInfo?.score || 0}</span>
                                <span className="text-gray-400 ml-2 text-sm font-normal">
                                By {animeInfo?.scored_by?.toLocaleString() || 0} users
                                </span>
                            </InfoRow>

                            <InfoRow label="Date Aired:">
                                {new Date(animeInfo?.aired?.from || '').toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                })}{' '}
                                to{' '}
                                {animeInfo?.aired?.to ? new Date(animeInfo?.aired?.to || '').toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                }): 'TBA'}
                            </InfoRow>

                            <InfoRow label="Broadcast:">
                                {animeInfo.broadcast.string || '??'}
                            </InfoRow>

                            <InfoRow label="Status:">
                                {animeInfo?.airing ? 'Ongoing' : 'Finished'}
                            </InfoRow>

                            <InfoRow label="Episodes:">
                                {animeInfo?.episodes || '????'}
                            </InfoRow>

                            <InfoRow label="Duration:">
                                {animeInfo?.duration || '???'}
                            </InfoRow>
                        </ul>

                        </div>
                        <div className='h-full w-full'>
                        <ul className="h-full flex flex-col gap-3 justify-start">
                            <InfoRow label="Premiered:">
                                {animeInfo?.season
                                ? animeInfo.season.charAt(0).toUpperCase() + animeInfo.season.slice(1)
                                : '???'}{' '}
                                {animeInfo?.year || '???'}
                            </InfoRow>

                            <InfoRow label="Studios:">
                                {animeInfo?.studios?.map((studio) => studio.name).join(', ') || '???'}
                            </InfoRow>

                            <InfoRow label="Producers:">
                                <span className="line-clamp-2 ps-0">
                                {animeInfo?.producers?.map((producer) => producer.name).join(', ') || '???'}
                                </span>
                            </InfoRow>

                            <InfoRow label="Source:">
                                {animeInfo?.source || '???'}
                            </InfoRow>

                            <InfoRow label="Genre:">
                                <span className="line-clamp-4 ps-0">
                                {animeInfo?.genres?.map((genre) => genre.name).join(', ') || '???'}
                                </span>
                            </InfoRow>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis */}
            <div className='w-full h-full  '>
                <div className='w-full h-fit  py-0 px-0 flex flex-col'>
                    <div className='flex-1 h-fit flex flex-col gap-2'>
                        <h1 className='text-white text-xl md:text-2xl font-bold'>Synopsis</h1>
                        <div className='text-gray-400 text-[0.8rem] md:text-sm lg:text-base bg-themeDarker border border-themeLightDark rounded-lg p-3'>{animeInfo?.synopsis?.replace('[Written by MAL Rewrite]', '')}</div>
                    </div>
                </div>
            </div>

            {/* Characters */}
            <Characters mal_id={id} />

            {/* Related */}
            <section className='max-h-[370px]'>
            <RelatedAnime />
            </section>

            {/* Recommendations got mobile */}
            <section className=''>
            <MobileRecommendations title={animeInfo?.title} />
            </section>

            {/* Reviews */}
            <Reviews mal_id={id} />
        </div>
        :
        // Loader
        <div className='w-full col-span-13 h-[100svh] bg-[#141414] mt-20 z-90  p-4'>
            
            <div className="flex gap-6">

                <div className="w-48 h-72 bg-gray-800 animate-pulse rounded"></div>

                <div className="flex-1 space-y-4">
                <div className="h-6 w-3/4 bg-gray-800 animate-pulse rounded"></div>
                <div className="h-4 w-1/3 bg-gray-700 animate-pulse rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                    {Array(6).fill(0).map((_, idx) => (
                    <div key={idx} className="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
                    ))}
                </div>
                </div>
            </div>

            <div className="my-6 h-0.5 bg-gray-700"></div>

            <div>
                <div className="h-6 w-32 bg-gray-800 animate-pulse rounded mb-4"></div>
                <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-gray-700 animate-pulse rounded"></div>
                </div>
            </div>

            <div className="mt-10">
        <div className="h-6 w-32 bg-gray-800 animate-pulse rounded mb-4"></div>
        <div className="flex gap-4 flex-wrap">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="w-28">
              <div className="w-28 h-36 bg-gray-800 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
        </div>
    }
        {/* Recommendations right side */}
        <section className='col-span-3'>
        <Recommendations title={animeInfo?.title} />
        </section>
  </main>
  )
}

export default AnimeOverView