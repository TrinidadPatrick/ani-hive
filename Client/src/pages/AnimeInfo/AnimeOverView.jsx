import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import ReactPlayer from 'react-player';
import 'video.js/dist/video-js.css';
import NoTrailerAvailable from '../../components/NoTrailerAvailable.jsx';
import useSmallScreen from '../../utils/useSmallScreen.js';
import AnimeRecommendationSkeleton from './skeleton/AnimeRecommendationSkeleton.jsx';
import AnimeRelatedSkeleton from './skeleton/AnimeRelatedSkeleton.jsx';
import AnimeReviewsSkeleton from './skeleton/AnimeReviewsSkeleton.jsx';
import getYoutubeId from '../../utils/getYoutubeId.js';
import TrailerPlayer from '../../components/TrailerPlayer.jsx';
import useUserAnimeStore from '../../stores/UserAnimeStore.js';
import { Play, Plus } from 'lucide-react';
import StatusDrodown from '../../components/MalComponents/MalAnimeList/StatusDrodown.jsx';

const AnimeOverView = () => {
    const checkIsSaved = useUserAnimeStore((s) => s.checkIsSaved)
    const updateAnime = useUserAnimeStore((s) => s.updateAnime)
    const isSmallScreen = useSmallScreen()

    const reactionEmojis = ["📊", "👍", "❤️", "😂", "🤔", "📘", "✍️", "🎨"];
    const {id} = useParams()
    const textRef = useRef(null);
    const [selectedWatchStatus, setSelectedWatchStatus] = useState(null)
    const [animeUserStatus, setAnimeUserStatus] = useState(null)
    const [animeInfo, setAnimeInfo] = useState(null)
    const [characters, setCharacters] = useState(null)
    const [animeRelations, setAnimeRelations] = useState(null)
    const [recommendations, setRecommendations] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [hovered, setHovered] = useState(-1)
    const [indexSeeMore, setIndexSeeMore] = useState([])
    const [indexSeeReview, setIndexSeeReview] = useState([])
    const [showTrailer, setShowTrailer] = useState(false)
    const [youtubeId, setYoutubeId] = useState(null)

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    
    const checkAnimeForUser = async (anime_id) => {
        const result = await checkIsSaved(anime_id)
        if(result && result.my_list_status){
            setAnimeUserStatus(result.my_list_status)
            setSelectedWatchStatus(result.my_list_status.status)
        }
    }

    const handleAction = async (status = 'plan_to_watch') => {
        const {num_episodes_watched, score} = animeUserStatus ? animeUserStatus : {num_episodes_watched : 0, score: 0}
        const result = await updateAnime({id, num_watched_episodes : num_episodes_watched, score, status})
    }
    

    const getAnimeInfo = async (mal_id, option, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/full`)
                if(result.status === 200) {
                    const anime = result.data.data
                    if(option == 1){
                        setAnimeInfo(anime)
                    }else{
                        return anime
                    }
                }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getAnimeInfo(searchTerm, retries - 1)
                }, 1000)
            }
        }
    }

    const getCharacters = async(mal_id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/characters`)
                if(result.status === 200) {
                    const characters = result.data.data
                    const sortedCharacters = characters.sort((a,b) => b.favorites - a.favorites)
                    setCharacters(sortedCharacters)
                }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getCharacters(mal_id, retries - 1)
                }, 1000)
            }
        }
    }  
    
    const getAnimeRelations = async (title, retries = 10) => {
        const query = `
        query ($search: String) {
        Media (search: $search, type: ANIME) { 
            id
            title {
            romaji
            english
            native
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

        const variables = { search: title };

        try {
            const { data } = await axios.post(
            'https://graphql.anilist.co',
            { query, variables },
            { headers: { 'Content-Type': 'application/json' } }
            );
            const results = data.data.Media.relations.nodes
            if(results){
                const relatedAnimes = results.filter((result) => result.type === "ANIME" && result.idMal)
                setAnimeRelations(relatedAnimes)
            }   
        } catch (err) {
            console.log(err);
            setAnimeRelations([])
        }
    };

    const getRecommendations = async (searchTerm) => {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
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

    const getUserReviews = async (id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${id}/reviews`)
                if(result.status === 200) {
                    const reviews = result.data.data
                    const sortedReviews = reviews.sort((a,b) => new Date(b.date) - new Date(a.date))
                    setReviews(sortedReviews)
                }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getUserReviews(id, retries - 1)
                }, 1000)
            }
        }
    }

    const handleSeeMore = (index) => {
        const newIndex = indexSeeMore.findIndex((item) => item === index)
        if(newIndex !== -1){
            const newIndexSeeMore = [...indexSeeMore]
            newIndexSeeMore.splice(newIndex, 1)
            setIndexSeeMore(newIndexSeeMore)
        }else{
            const newIndexSeeMore = [...indexSeeMore, index]
            setIndexSeeMore(newIndexSeeMore)
        }
    }

    const handleSeeReview = (index) => {
        const newIndex = indexSeeReview.findIndex((item) => item === index)
        if(newIndex !== -1){
            const newIndexSeeReview = [...indexSeeReview]
            newIndexSeeReview.splice(newIndex, 1)
            setIndexSeeReview(newIndexSeeReview)
        }else{
            const newIndexSeeReview = [...indexSeeReview, index]
            setIndexSeeReview(newIndexSeeReview)
        }
    }

    const InfoRow = ({ label, children }) => (
        <li className="flex justify-start gap-2">
          <h1 className="text-gray-400 min-w-[80px] text-[0.8rem] lg:text-base font-medium ">{label}</h1>
          <h1 className="text-gray-200 line-clamp-1 text-[0.8rem] lg:text-base">{children}</h1>
        </li>
    );

    useEffect(() => {
        if (id) {
          (async () => {
            await checkAnimeForUser(id)
            await getAnimeInfo(id, 1);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await getCharacters(id);
          })();
        }
    }, [id]);

    useEffect(() => {
        if(animeInfo && characters && (( !animeRelations) || ( !recommendations))) {        
            (async()=>{
                getRecommendations(animeInfo?.title)
                await new Promise(resolve => setTimeout(resolve, 1000));
                getAnimeRelations(animeInfo.title)
                await new Promise(resolve => setTimeout(resolve, 1000))
                getUserReviews(id)
            })()
        const youtubeId = getYoutubeId(animeInfo?.trailer?.embed_url)
        setYoutubeId(youtubeId)
        }
    }, [animeInfo, characters])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

  return (
  <main className='w-full grid grid-cols-13 h-fit relative overflow-x-hidden'>
    <div 
    className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80)] z-0 brightness-60 opacity-70" 
    aria-hidden="true"
  />
    
    {showTrailer && <TrailerPlayer youtubeId={youtubeId} setShowTrailer={setShowTrailer} />}
    {
        animeInfo ?
        <div className='w-full col-span-13 xl:col-span-10 h-fit py-20 px-5 flex flex-col gap-5 z-90'>

            {/* Top Section */}
            <div className='flex-none h-full flex flex-col sm:flex-row gap-2'>
                <div className='w-full aspect-video sm:aspect-auto sm:w-[200px]'>
                    <img src={animeInfo?.images?.jpg.large_image_url} alt={animeInfo?.title_english || animeInfo?.title} className='w-full sm:h-full aspect-video object-cover rounded-lg' />
                </div>
                <div className='flex-1 h-full  flex flex-col gap-2 px-2'>
                    {/* Badges */}
                    <div className='w-full flex gap-2 my-1'>
                        <div className='px-2 py-0.5 bg-pink-600 rounded'>
                            <h1 className='text-white text-xs font-medium'>{animeInfo?.rating ? animeInfo?.rating.split(' - ')[0] : 'N/A'}</h1>
                        </div>
                        <div className='px-2 py-0.5 bg-pink-600 rounded'>
                            <h1 className='text-white text-xs font-medium'>{animeInfo?.type}</h1>
                        </div>
                        <div className='px-2 py-0.5 bg-pink-600 rounded'>
                            <h1 className='text-white text-xs font-medium'>#{animeInfo?.rank}</h1>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='w-full flex flex-col w gap-2 justify-between'>
                        <div className=''>
                        <h1 className='text-white text-2xl lg:text-3xl font-bold line-clamp-2'>{animeInfo?.title_english || animeInfo?.title}</h1>
                        </div>
                        <div className='flex gap-2 my-2 '>
                            <button onClick={()=>{setShowTrailer(true)}} className='flex gap-2 text-white whitespace-nowrap text-xs md:text-base px-5 py-2 bg-themeDark border border-[#3a3a3a] rounded-lg font-medium cursor-pointer hover:bg-themeDarker'>
                                <Play width={17} />
                                Watch Trailer
                            </button>
                            {
                                animeUserStatus ? (
                                <div className='w-[130px]'>
                                <StatusDrodown 
                                selectedWatchStatus={selectedWatchStatus} 
                                setSelectedWatchStatus={setSelectedWatchStatus} 
                                background={'pink-600'} border={'gray-500'} textColor={'gray-100'} 
                                action={handleAction}
                                />
                                </div>
                                )
                                :
                                (
                                <button onClick={()=>{handleAction()}} className='flex gap-2 text-white whitespace-nowrap text-xs md:text-base px-5 py-2 bg-pink-600 rounded-lg font-medium cursor-pointer hover:bg-pink-500'>
                                    <Plus width={17} />
                                    Add to library
                                </button>
                                )
                            }
                        </div>
                    </div>
                    
                    {/* Other informations */}
                    <div className='w-full h-full grid grid-cols-1 md:grid-cols-2'>
                        <div className='h-full w-full'>

                        <ul className="h-full gap-1 flex flex-col justify-between">
                            <InfoRow label="Score:">
                                {animeInfo?.score || 0}
                                <span className="text-gray-400 ml-2">
                                By {animeInfo?.scored_by?.toLocaleString() || 0} users
                                </span>
                            </InfoRow>

                            <InfoRow label="Premiered:">
                                {animeInfo?.season
                                ? animeInfo.season.charAt(0).toUpperCase() + animeInfo.season.slice(1)
                                : '???'}{' '}
                                {animeInfo?.year || '???'}
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

                            <InfoRow label="Status:">
                                {animeInfo?.airing ? 'Ongoing' : 'Finished'}
                            </InfoRow>

                            <InfoRow label="Episodes:">
                                {animeInfo?.episodes || '????'}
                            </InfoRow>

                            <InfoRow label="Duration:">
                                {animeInfo?.duration || '???'}
                            </InfoRow>

                            <InfoRow label="Genre:">
                                {animeInfo?.genres?.map((genre) => genre.name).join(', ') || '???'}
                            </InfoRow>
                        </ul>

                        </div>
                        <div className='h-full w-full'>
                        <ul className="h-full flex flex-col gap-2 justify-start">
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
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
             <hr className='text-gray-600 mt-3'></hr>                               
            {/* Synopsis */}
            <div className='w-full h-full '>
                <div className='w-full h-fit  py-0 px-0 flex flex-col'>
                    <div className='flex-1 h-fit flex flex-col gap-2'>
                        <h1 className='text-white text-xl md:text-2xl font-bold'>Synopsis</h1>
                        <p className='text-white text-[0.8rem] md:text-sm lg:text-base'>{animeInfo?.synopsis.replace('[Written by MAL Rewrite]', '')}
                        
                        </p>
                    </div>
                </div>
            </div>
            {/* Characters */}
            <div className='w-full  h-fit flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-xl md:text-2xl font-bold'>Characters</h1>
                </div>
                <div className='relative'>
                <Swiper
                modules={[FreeMode, Navigation]}
                freeMode={true}
                spaceBetween={20}
                slidesPerView={2}
                slidesPerGroup={1}  grabCursor={true}
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
                    slidesPerGroup: 3,
                },
                481: {
                    slidesPerView: 3,
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
                className="w-full h-fit mx-auto "
                >
                {characters?.length > 0 &&
                characters.map((char, index, array) =>
                {
                    return (
                    <div className='relative'>
                    <SwiperSlide
                    key={index}
                    onMouseEnter={()=>{!isSmallScreen && setTimeout(()=>{setHovered(index)}, 150)}}
                    onMouseLeave={()=>{!isSmallScreen && setTimeout(()=>{setHovered(-1)}, 150)}}
                    onClick={()=>{isSmallScreen && setTimeout(()=>{hovered === index ? setHovered(-1) : setHovered(index)}, 150)}}
                    style={{ width: '195px', height: 'auto' }} // or use fixed or dynamic width based on screen
                    className={`sm:peer-hover:rotate-y-180 transform duration-300 ease-in-out delay-75 h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer`}
                    >
                        <div className='w-full h-full top-0 absolute bg-transparent peer z-[9999999999999]'></div>
                    <div className={`sm:peer-hover:rotate-y-180 transform duration-300 ease-in-out delay-75 relative h-fit overflow-hidden rounded-lg`}>
                    <div className={`${hovered == index ? 'sm:rotate-y-180' : ''} w-fit flex items-center absolute z-[999] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-1`}>
                    <div className=" w-full h-full bg-black opacity-55 absolute left-0 top-0"></div>
                    <p className="z-[9999] mt-[1px] text-sm">{char?.role}</p>
                    </div>
                        {/* Image */}
                        <div className="w-full  h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                            <img
                                src={hovered == index ? char?.voice_actors[0]?.person?.images.jpg.image_url : char?.character.images.jpg.image_url}
                                alt={char?.character?.name}
                                className="w-full aspect-[2/2.8] object-cover brightness-70"
                            />
                        </div>

                        {/* Info */}
                        <div className={`${hovered == index ? 'sm:rotate-y-180' : ''} w-full absolute px-1 md:px-3 py-1 bottom-0 bg-transparent backdrop-blur-xl rounded-b-lg flex`}>
                        <div className="flex flex-col items-start w-full h-full justify-around">
                            {
                                hovered == index ?
                                (
                                    <h2 className="text-gray-300 text-xs md:text-sm line-clamp-1">
                                    {char?.voice_actors[0]?.person?.name}
                                    </h2>
                                )
                                :
                                (
                                    <h2 className="text-white text-sm md:text-base w-full line-clamp-1">
                                    {char?.character?.name}
                                    </h2>
                                )

                            }
                        </div>
                        </div>
                    </div>
                    </SwiperSlide>
                    </div>
                    )
                    })
                }
                
                </Swiper>          
                </div>                       
            </div>
            {/* Related */}
            <div className='w-full flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-xl md:text-2xl font-bold'>Related</h1>
                </div>
                {
                    animeRelations && animeRelations?.length == 0 &&
                    <div className='w-full h-full flex justify-center items-center'>
                        <h1 className='text-gray-500 text-2xl'>No Related Anime</h1>
                    </div>
                }
                <div className='relative'>
                {
                    !animeRelations ?
                    (
                        <AnimeRelatedSkeleton />
                    )
                    :
                    animeRelations && animeRelations?.length !== 0 &&
                    (
                        <Swiper
                        modules={[FreeMode, Navigation]}
                        freeMode={true}
                        spaceBetween={20}
                        slidesPerView={2}
                        slidesPerGroup={1}  grabCursor={true}
                        navigation={{
                        nextEl: nextRef.current,
                        prevEl: prevRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;animeRelations
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
                        className="w-full mx-auto "
                        >
                        {animeRelations && animeRelations?.length > 0 &&
                        animeRelations.map((info, index, array) =>
                        {
                            if(1 === 1){
                            return (
                            <SwiperSlide
                            key={index}
                            onClick={()=>{window.location.href = `/anime/${info.idMal}`}}
                            style={{ width: '195px', height: '40svh' }} // or use fixed or dynamic width based on screen
                            className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
                            >
                            <div className="relative h-fit overflow-hidden rounded-lg">
                            <div className=' absolute top-1 left-2 z-[999999999999] px-2 py-0.5 rounded-lg flex items-center justify-center gap-1'>
                                <div className='bg-black opacity-55 absolute w-full h-full rounded-lg'></div>
                                <p className='text-white z-[9999999] text-sm'>{info?.type}</p>
                            </div>
                                {/* Image */}
                                <div className="w-full  h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                                <img
                                    src={info?.coverImage.large}
                                    alt={info?.title.english || info?.title.romaji}
                                    className="w-full aspect-[2/2.8]  object-cover brightness-70"
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
                            )
                            }})
                        }
                        
                        </Swiper>  
                    )
                }        
                </div>                       
            </div>
            {/* Recommendations */}
            <div className='w-full flex xl:hidden flex-col gap-3'>
                <div>
                    <h1 className='text-white text-xl md:text-2xl font-bold'>Recommendations</h1>
                </div>
                {
                    recommendations === null &&
                    (
                        <AnimeRecommendationSkeleton />
                    )
                }
                {
                    recommendations && recommendations?.length === 0 ?
                    (
                    <div className='w-full h-full flex justify-center items-center '>
                        <h1 className='text-gray-400 text-2xl'>No Recommendations</h1>
                    </div>
                    )
                    :
                    recommendations && recommendations?.length !== 0 &&
                    (
                    <div className='relative'>
                    <Swiper
                    modules={[FreeMode, Navigation]}
                    freeMode={true}
                    spaceBetween={20}
                    slidesPerView={2}
                    slidesPerGroup={1}  grabCursor={true}
                    navigation={{
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;animeRelations
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
                    className="w-full mx-auto "
                    >
                    {recommendations.length > 0 &&
                    recommendations.map((recommendation, index, array) =>
                    {
                        if(1 === 1){
                        return (
                        <SwiperSlide
                        key={index}
                        onClick={()=>window.location.href = `/anime/${recommendation.mediaRecommendation.id}?name=${recommendation.mediaRecommendation.title.romaji}`}
                        style={{ width: '195px', height: '40svh' }} // or use fixed or dynamic width based on screen
                        className="h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer"
                        >
                        <div className="relative h-fit overflow-hidden rounded-lg">
                        <div className=' absolute top-1 left-2 z-[999999999999] px-2 py-0.5 rounded-lg flex items-center justify-center gap-1'>
                            <div className='bg-black opacity-55 absolute w-full h-full rounded-lg'></div>
                            <p className='text-white z-[9999999] text-sm'>{recommendation?.mediaRecommendation?.nextAiringEpisode?.episode || recommendation?.mediaRecommendation?.episodes }/{recommendation?.mediaRecommendation?.episodes}</p>
                        </div>
                            {/* Image */}
                            <div className="w-full  h-fit rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03]">
                            <img
                                src={recommendation?.mediaRecommendation?.coverImage?.large}
                                alt={recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji}
                                className="w-full aspect-[2/2.8]  object-cover brightness-70"
                            />
                            </div>

                            {/* Info */}
                            <div className="w-full px-1 md:px-2 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[30%] rounded-b-lg flex">
                            <div className="flex flex-col items-start w-full h-full justify-around">
                                <h2 className="text-white text-sm md:text-sm w-full line-clamp-3 text-center">
                                {recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji}
                                </h2>
                            </div>
                            </div>
                        </div>
                        </SwiperSlide>
                        )
                        }})
                    }
                    
                    </Swiper>          
                    </div>   
                    )
                }                
            </div>
            {/* Reviews */}
            <div className='w-full flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-xl md:text-2xl font-bold'>Reviews</h1>
                </div>
                {
                    reviews && reviews?.length == 0 &&
                    <div className='w-full h-full flex justify-center items-center'>
                        <h1 className='text-gray-500 text-2xl'>No Reviews</h1>
                    </div>
                }
                <div className='w-full h-full flex flex-col gap-2'>
                    {
                        reviews && reviews?.length > 0 ?
                        reviews.map((review, index, array) =>
                        {
                            const textLength = review.review.length
                            const date = new Date(review.date)
                            const dateString = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })

                            return (
                                <div key={index} className='w-full flex gap-2'>
                                    
                                    <div className='w-[50px] aspect-[2/2.3] flex-none'>
                                        <img src={review?.user?.images?.jpg.image_url} alt={review?.author?.name} className='w-full aspect-square object-cover rounded-lg' />
                                    </div>
                                    <div className='flex flex-col justify-between py-0 items-start'>
                                        <div className='flex flex-col gap-1'>
                                        {/* Date and name */}
                                        <div className='flex justify-between'>
                                        <h2 className='text-white font-medium text-sm md:text-base line-clamp-2 '>{review?.user?.username}</h2>
                                        <p className='text-gray-400 text-sm'>{dateString}</p>
                                        </div>
                                        {/* Tag */}
                                        <div className='flex gap-3'>
                                            {
                                                review?.tags?.length > 0 &&
                                                review?.tags.map((tag, index, array) =>
                                                {
                                                    return (
                                                        <div key={index} className='px-2 py-0.5 bg-[#ff96d812] rounded'>
                                                            <h1 className='text-pink-400 text-xs font-medium'>{tag}</h1>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {/* Review Content */}
                                        <div className='relative'>
                                            {/* Spoiler Warning */}
                                            {
                                                !indexSeeReview.includes(index) &&  review?.is_spoiler &&
                                                <div className='absolute w-full h-full backdrop-blur-xs rounded-lg z-[9999999] flex flex-col justify-center items-center'>
                                                <h1 className='text-white text-lg font-bold'>Spoiler Warning</h1>
                                                <p className='text-white text-sm'>This review contains spoilers</p>
                                                <button onClick={()=>handleSeeReview(index)} className='text-white px-2 py-1 bg-pink-400 hover:bg-pink-500 rounded text-sm cursor-pointer hover:text-gray-200 w-fit'>See review</button>
                                                </div>
                                            }
                                        {
                                            textLength <= 1200 ?
                                            <p className='text-gray-200 text-sm whitespace-pre-line'>{review?.review}</p>
                                            :
                                            <p
                                            ref={textRef}
                                            className={`text-gray-300 text-sm whitespace-pre-line transition-all duration-300 ease-in-out overflow-hidden ${
                                                indexSeeMore.includes(index) ? 'max-h-[1000px]' : 'max-h-[8.5rem] line-clamp-6'
                                            }`}
                                            >
                                            {review?.review}
                                            </p>
                                        }
                                        {/* See More Button */}
                                        {
                                            textLength > 1200 &&
                                            <button 
                                            onClick={()=>{handleSeeMore(index)}}
                                            className='text-white text-sm cursor-pointer hover:text-gray-200  w-fit'>{
                                                indexSeeMore.includes(index) ? 'see less' : 'see more'
                                            }</button>
                                        }
                                        </div>
                                        <div className='flex gap-3 flex-wrap p-2 bg-[#34343438] rounded'>
                                            {
                                                Object.entries(review.reactions).map(([key, value], index)=>{
                                                    const reaction = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
                                                    return (
                                                        <p key={index} className='text-white text-xs sm:text-sm font-light px-2 py-1 border rounded border-gray-400'>{reaction} {reactionEmojis[index]}: {value}</p>
                                                    )
                                                })
                                            }
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        !reviews &&
                        (
                            <AnimeReviewsSkeleton />
                        )
                    }
                </div>
            </div>
        </div>
        :
        // Loader
        <div className='w-full col-span-12 h-[100svh] bg-[#141414] mt-20 z-90'>
            
            {/* Header */}
            <div className="flex gap-6">
                {/* Poster Skeleton */}
                <div className="w-48 h-72 bg-gray-800 animate-pulse rounded"></div>

                {/* Info Skeleton */}
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

            {/* Divider */}
            <div className="my-6 h-0.5 bg-gray-700"></div>

            {/* Synopsis */}
            <div>
                <div className="h-6 w-32 bg-gray-800 animate-pulse rounded mb-4"></div>
                <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-gray-700 animate-pulse rounded"></div>
                </div>
            </div>

            {/* Characters */}
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
        {/* Recommendations */}
        <div className='recoList xl:col-span-3 hidden xl:flex h-fit pb-5 bg-[#141414] overflow-auto mt-20 flex-col gap-3 z-90'>
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
                recommendations?.map((recommendation, index, array) =>
                {
                    return (
                        <div onClick={()=>window.location.href = `/anime/${recommendation.mediaRecommendation.idMal}`} key={index} className='w-full hover:bg-[#212121] flex gap-2 cursor-pointer'>
                            <div className='w-[90px] aspect-[2/2.3] flex-none'>
                                <img src={recommendation?.mediaRecommendation?.coverImage?.large} alt={recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji} className='w-full h-full object-cover rounded-lg' />
                            </div>
                            <div className='flex flex-col justify-between py-1'>
                                <div>
                                <h2 className='text-white font-medium text-sm md:text-[0.9rem] line-clamp-2'>{recommendation?.mediaRecommendation?.title?.english || recommendation?.mediaRecommendation?.title?.romaji}</h2>
                                <p className='text-gray-300 text-sm'>Ep {recommendation?.mediaRecommendation?.nextAiringEpisode?.episode || recommendation?.mediaRecommendation?.episodes }/{recommendation?.mediaRecommendation?.episodes}</p>
                                </div>
                                <p className='text-gray-300 text-sm'>{recommendation?.mediaRecommendation?.genres?.join(', ')}</p>
                            </div>
                        </div>
                    )
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
  </main>
  )
}

export default AnimeOverView