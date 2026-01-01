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
import VideoJS from './Video';
import Youtube from 'react-youtube'
import NoTrailerAvailable from '../../components/NoTrailerAvailable.jsx';
import useSmallScreen from '../../utils/useSmallScreen.js';
import AnimeRecommendationSkeleton from './skeleton/AnimeRecommendationSkeleton.jsx';
import AnimeRelatedSkeleton from './skeleton/AnimeRelatedSkeleton.jsx';
import AnimeReviewsSkeleton from './skeleton/AnimeReviewsSkeleton.jsx';

const AnimeOverView = () => {
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const isSmallScreen = useSmallScreen()

    const reactionEmojis = ["📊", "👍", "❤️", "😂", "🤔", "📘", "✍️", "🎨"];
    const {id} = useParams()
    const textRef = useRef(null);
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const [animeInfo, setAnimeInfo] = useState(null)
    const [characters, setCharacters] = useState(null)
    const [animeRelations, setAnimeRelations] = useState(null)
    const [recommendations, setRecommendations] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [hovered, setHovered] = useState(-1)
    const [indexSeeMore, setIndexSeeMore] = useState([])
    const [indexSeeReview, setIndexSeeReview] = useState([])
    const [showTrailer, setShowTrailer] = useState(false)

    const [epUrl, setEpUrl] = useState('')
    const [selectedEp, setSelectedEp] = useState({})
    const [animeEpisodes, setAnimeEpisodes] = useState([])
    const [epInfo, setEpInfo] = useState(null);
    const [selectedQuality, setSelectedQuality] = useState(null)
    const [showSettings, setShowSettings] = useState(false);
    const [buttonRect, setButtonRect] = useState(null);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const buildUrl = (url) => {
        const encodedUrl = encodeURIComponent(
            url
        );
        const proxyUrl = `https://cosumet-api.vercel.app/anime/animepahe/proxy?url=${encodedUrl}`;

        return proxyUrl
    }

    let videoJsOptions = {
        autoplay: true,
        muted: true, // required for autoplay
        controls: true, 
        responsive: true,
        fluid: true,
        controlBar: {
          skipButtons: {
            forward: 10,
            backward: 10,
          },
          volumePanel: {
            inline: false,
          },
        },
        sources: [{
          src: epUrl, 
          type: 'application/x-mpegURL',
        }],
    };
      

    const getAnimeInfo = async (id, option, retries = 10) => {
        if(name && option == 1)
        {
            const malId = await fetchAnimeId(name)
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${malId}/full`)
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
                        getAnimeInfo(1, retries - 1)
                    }, 1000)
                }
            }
        }else{
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`)
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
            }
        }
    }

    const getCharacters = async(id) => {
        if(name){
            const malId = await fetchAnimeId(name)
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${malId}/characters`)
                if(result.status === 200) {
                    const characters = result.data.data
                    const sortedCharacters = characters.sort((a,b) => b.favorites - a.favorites)
                    setCharacters(sortedCharacters)
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`)
                if(result.status === 200) {
                    const characters = result.data.data
                    const sortedCharacters = characters.sort((a,b) => b.favorites - a.favorites)
                    setCharacters(sortedCharacters)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const fetchAnimeId = async (animeTitle) => {
    try {
        // Step 1: Get idMal from AniList
        const anilistQuery = `
        query ($search: String) {
            Media(search: $search, type: ANIME) {
            id
            idMal
            title {
                romaji
                english
                native
            }
            }
        }
        `;

        const response = await axios.post('https://graphql.anilist.co', {
        query: anilistQuery,
        variables: { search: animeTitle }
        });

        const idMal = response.data.data.Media.idMal;

        if (!idMal) {
        console.warn(`No MAL ID found for ${animeTitle}`);
        return null;
        }

        return idMal

        // Step 2: Use idMal with Jikan
        // const jikanResponse = await axios.get(`https://api.jikan.moe/v4/anime/${idMal}/full`);
        // setAnimeInfo(jikanResponse.data.data)

    } catch (error) {
        console.error('Error fetching anime details:', error);
        return null;
    }
    };     
    
    const getAnimeRelations = async (mal_id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/relations?type=anime`)
            const flattened = result.data.data.flatMap(item =>
                item.entry.map(entryObj => ({
                  relation: item.relation,
                  ...entryObj
                }))
              );
            const animes = flattened.filter((anime) => anime.type === 'anime')
            if(animes?.length === 0){
                setAnimeRelations([])
            }
            for(const anime of animes){
                const info = await getAnimeInfo(anime.mal_id, 2)
                info.type = anime.type
                if(animeRelations === null){
                    setAnimeRelations([info]);
                }else{
                    setAnimeRelations(prev => {
                    const isExist = prev?.findIndex(item => item.mal_id === info.mal_id) || -1;
                    if (isExist === -1) {
                      return prev ?[...prev, info] : [info]; // create new array (immutable update)
                    }
                    return prev; // no change
                  });
                }
                await new Promise(resolve => setTimeout(resolve, 550));
            }

        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getAnimeRelations(searchTerm, retries - 1)
                }, 1000)
            }
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
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                type
                format
                startDate {
                  year
                }
                nextAiringEpisode {
                    episode
                    airingAt
                  }
                  genres
                episodes
                duration     # average episode length, in minutes
                status       # e.g. FINISHED, RELEASING
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

    const getUserReviews = async (id) => {
        if(name){
            const malId = await fetchAnimeId(name)
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${malId}/reviews`)
                if(result.status === 200) {
                    const reviews = result.data.data
                    const sortedReviews = reviews.sort((a,b) => new Date(b.date) - new Date(a.date))
                    setReviews(sortedReviews)
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                const result = await axios.get(`https://api.jikan.moe/v4/anime/${id}/reviews`)
                if(result.status === 200) {
                    const reviews = result.data.data
                    const sortedReviews = reviews.sort((a,b) => new Date(b.date) - new Date(a.date))
                    setReviews(sortedReviews)
                }
            } catch (error) {
                console.log(error)
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

    const getAnimePaheInfo = async (title) => {
        try {
            const res = await axios.get(`https://cosumet-api.vercel.app/anime/animepahe/${encodeURIComponent(title)}`)
            const data = res.data.results
            if(data.length > 0){
                for (const anime of data) {
                    if((animeInfo.title.toLowerCase() == anime.title.toLowerCase() || animeInfo.title_english.toLowerCase() == anime.title.toLowerCase()) && (animeInfo.year == anime.releaseDate || animeInfo.score == anime.rating)){
                        const res = await axios.get(`https://cosumet-api.vercel.app/anime/animepahe/info/${anime.id}`)
                        const animeData = res.data
                        setAnimeEpisodes(animeData.episodes)
                        handleSelectEp(animeData.episodes[0].id, animeData.episodes[0])
                        break;
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const TrailerPlayer = useCallback(()=>{
        return (
            <main className='fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.9)]'>
                
                {
                    !animeInfo?.trailer.youtube_id && !animeInfo?.trailer?.embed_url ? (
                        <>
                        <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-20 right-5 z-[99999999999999999]'>Close</button>
                        <NoTrailerAvailable />
                        </>
                    )
                    :
                    (
                    <>
                        {
                            isSmallScreen ? 
                            (
                                <div className='flex flex-col justify-center w-[100vw] h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-10 right-5 z-[99999999999999999]'>Close</button>
                                <ReactPlayer
                                            url={animeInfo?.trailer.youtube_id ? `https://www.youtube.com/watch?v=${animeInfo?.trailer.youtube_id}&?vq=hd720` : animeInfo?.trailer?.embed_url}
                                            width="100%"
                                            // height="100%"
                                            playing={true}
                                            muted={false}
                                            loop={true}
                                            controls={false}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className=' flex items-center justify-center w-[100vw] md:h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                    <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-5 right-7 cursor-pointer z-[99999999999999999]'>Close</button>
                                    <ReactPlayer
                                            url={animeInfo?.trailer.youtube_id ? `https://www.youtube.com/watch?v=${animeInfo?.trailer.youtube_id}&?vq=hd720` : animeInfo?.trailer?.embed_url}
                                            width="90%"
                                            height="90%"
                                            playing={false}
                                            muted={false}
                                            loop={true}
                                            controls={false}
                                    />
                                </div>
                            )
                        }
                    </>
                    )
                }
            </main>
            )
    }, [animeInfo, isSmallScreen])

    const handleSelectEp = async (id, ep) => {
        try {
            setSelectedEp(ep)
            const res = await axios.get(`https://cosumet-api.vercel.app/anime/animepahe/watch?episodeId=${id}`)
            const qualities = res.data.sources.filter((source) => source.isDub == false)
            setEpInfo(qualities)
            const url = buildUrl(res.data.sources[1].url)
            setEpUrl(url)
        } catch (error) {
            console.log(error)
        }
        
    }

    const InfoRow = ({ label, children }) => (
        <li className="flex justify-start gap-2">
          <h1 className="text-gray-400 min-w-[80px] text-[0.8rem] lg:text-base font-medium ">{label}</h1>
          <h1 className="text-gray-200 line-clamp-1 text-[0.8rem] lg:text-base">{children}</h1>
        </li>
    );

    const handlePlayerReady = (player) => {
        // playerRef.current = player;
    
        // // You can handle player events here, for example:
        // player.on('waiting', () => {
        //   videojs.log('player is waiting');
        // });
    
        // player.on('dispose', () => {
        //   videojs.log('player will dispose');
        // });
    };

    const changeQuality = (quality) => {
        const player = playerRef.current;
        if (player) {
            const currentTime = player.currentTime();
            const isPaused = player.paused()

            player.src({ src: buildUrl(quality?.url)
            , type: 'application/x-mpegURL' });

            player.one('loadedmetadata', () => {
            player.currentTime(currentTime);
            if (!isPaused) {
                player.play();
            }
            });
            setShowSettings(false);
            setSelectedQuality(quality)
        }
    }

    useEffect(() => {
        if (id) {
          (async () => {
            await getAnimeInfo(id, 1);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await getCharacters(id);
          })();
        }
      }, [id]);

    useEffect(() => {
        if(animeInfo && characters && (( !animeRelations) || ( !recommendations))) {
            (async()=>{
                // getAnimePaheInfo(animeInfo?.title)
                getRecommendations(animeInfo?.title)
                await new Promise(resolve => setTimeout(resolve, 1000));
                getAnimeRelations(animeInfo?.mal_id)
                await new Promise(resolve => setTimeout(resolve, 1000))
                getUserReviews(id)
            })()
        }
    }, [animeInfo, characters])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

  return (
  <main className='w-full grid grid-cols-13 h-fit bg-[#141414] relative overflow-x-hidden'>
    {showTrailer && <TrailerPlayer />}
    {
        animeInfo ?
        <div className='w-full col-span-13 xl:col-span-10 h-fit bg-[#141414] py-20 px-5 flex flex-col gap-5'>
            {/* <div className='w-full'>
                <h1 className='text-white text-2xl lg:text-3xl font-bold'>{animeInfo?.title_english || animeInfo?.title}</h1>
            </div> */}
            {/* Player */}
            <div className={`hidden w-full ${epUrl == '' ? 'aspect-video' : 'h-fit'} relative `}>
            {
                epUrl == '' ?
                <div className="relative w-full aspect-video bg-gray-300 rounded-lg overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r bg-black animate-shimmer" />
                    {/* Play button placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                :
                <VideoJS epUrl={epUrl} videoRef={videoRef} playerRef={playerRef} setShowSettings={setShowSettings} setButtonRect={setButtonRect} options={videoJsOptions} onReady={handlePlayerReady}/>
            }
            {showSettings && buttonRect && (
                <div className="absolute bg-gray-900 border shadow-md w-[150px] rounded z-50"
                style={{
                    top: buttonRect.bottom - 295 + window.scrollY,
                    left: buttonRect.left - 140 + window.scrollX,
                }}
                >
                <p className="font-bold mb-2 text-white p-1 bg-gray-700">Quality</p>
                {
                    epInfo?.length > 0 &&
                    epInfo.map((ep, index, array) =>
                    {
                        return (
                            <div onClick={()=>{changeQuality(ep)}} key={index} className="flex cursor-pointer gap-2 items-center py-1 px-2">
                                <div className={`w-1 h-1 rounded-full ${selectedQuality?.quality == ep.quality ? 'bg-pink-500' : 'bg-gray-500'}`}></div>
                                <p className="text-white text-sm">{ep.quality.split('·')[1]}</p>
                            </div>
                        )
                    })
                }
                </div>
            )}
            </div>
            {/* Episodes */}
            <div className='hidden flex-col gap-2'>
            <h1 className='text-white text-xl md:text-2xl font-bold'>Episodes</h1>
            <span className=' text-red-500'>*Anime has been limited to 5 episodes only to avoid copyright issues</span>
            <div className='w-full h-fit gap-3 grid grid-cols-4 xxs:grid-cols-6 xs:grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24'>
                {
                    animeEpisodes.length > 0 &&
                    animeEpisodes.slice(0,5).map((episode, index, array) =>
                    {
                        return (
                            <button onClick={()=>handleSelectEp(episode.id, episode)} key={index} className={` h-fit flex flex-col gap-2 cursor-pointer ${selectedEp.number == episode.number ? 'bg-pink-500' : 'bg-gray-900'} hover:bg-pink-500 justify-center items-center rounded-sm px-3 py-1`}>
                                    <h1 className='text-white text-sm md:text-base line-clamp-1'>{index + 1}</h1>
                            </button>
                        )
                    })
                }
            </div>
            </div>
            {/* Top Section */}
            <div className='flex-none h-full flex flex-col sm:flex-row gap-2'>
                <div className='w-full aspect-video sm:aspect-auto sm:w-[200px]'>
                    <img src={animeInfo?.images?.jpg.large_image_url} alt={animeInfo?.title_english || animeInfo?.title} className='w-full sm:h-full aspect-video object-cover rounded-lg' />
                </div>
                <div className='flex-1 h-full  flex flex-col gap-2 px-2'>
                    <div className='w-full flex flex-col md:flex-row gap-2 md:gap-0 justify-between'>
                        <div className=''>
                        <h1 className='text-white text-2xl lg:text-3xl font-bold line-clamp-2'>{animeInfo?.title_english || animeInfo?.title}</h1>
                        </div>
                        <div>
                            <button onClick={()=>{setShowTrailer(true)}} className='text-white whitespace-nowrap text-xs md:text-base px-3 py-2 bg-pink-600 rounded font-medium cursor-pointer hover:bg-pink-500'>Watch Trailer</button>
                        </div>
                    </div>
                    
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
                            onClick={()=>{window.location.href = `/anime/${info.mal_id}`}}
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
                                    src={info?.images?.webp?.large_image_url}
                                    alt={info?.title_english || info?.title}
                                    className="w-full aspect-[2/2.8]  object-cover brightness-70"
                                />
                                </div>
        
                                {/* Info */}
                                <div className="w-full px-1 md:px-2 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[30%] rounded-b-lg flex">
                                <div className="flex flex-col items-start w-full h-full justify-around">
                                    <h2 className="text-white text-sm md:text-sm w-full line-clamp-3 text-center">
                                    {info?.title_english || info?.title}
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
        <div className='w-full col-span-12 h-[100svh] bg-[#141414] mt-20'>
            
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
        {/* Other anime list */}
        <div className='recoList xl:col-span-3 hidden xl:flex h-fit pb-5 bg-[#141414] overflow-auto mt-20 flex-col gap-3'>
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
                        <div onClick={()=>window.location.href = `/anime/${recommendation.mediaRecommendation.id}?name=${recommendation.mediaRecommendation.title.romaji}`} key={index} className='w-full hover:bg-[#212121] flex gap-2 cursor-pointer'>
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