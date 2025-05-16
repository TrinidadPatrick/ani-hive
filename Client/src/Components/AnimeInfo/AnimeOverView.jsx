import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper/modules';
import ReactPlayer from 'react-player';

const AnimeOverView = () => {
    const navigate = useNavigate()
    const reactionEmojis = ["📊", "👍", "❤️", "😂", "🤔", "📘", "✍️", "🎨"];
    const {id} = useParams()
    const textRef = useRef(null);
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const [animeInfo, setAnimeInfo] = useState(null)
    const [characters, setCharacters] = useState(null)
    const [animeRelations, setAnimeRelations] = useState([])
    const [recommendations, setRecommendations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [hovered, setHovered] = useState(-1)
    const [indexSeeMore, setIndexSeeMore] = useState([])
    const [indexSeeReview, setIndexSeeReview] = useState([])
    const [showTrailer, setShowTrailer] = useState(false)

    const prevRef = useRef(null);
    const nextRef = useRef(null);

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
            // const list = []
            for(const anime of animes){
                const info = await getAnimeInfo(anime.mal_id, 2)
                info.type = anime.type
                setAnimeRelations(prev => {
                    const isExist = prev.findIndex(item => item.mal_id === info.mal_id);
                    if (isExist === -1) {
                      return [...prev, info]; // create new array (immutable update)
                    }
                    return prev; // no change
                  });
                await new Promise(resolve => setTimeout(resolve, 550));
            }
            // setAnimeRelations(list)

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
        if(animeInfo && characters && (animeRelations.length == 0 || recommendations.length == 0)) {
            (async()=>{
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

    const TrailerPlayer = () => {
        return (
        <main onClick={()=>setShowTrailer(false)} className='fixed w-[100svw] cursor-pointer h-[100svh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.9)]'>
            <div className='w-[80vw] h-[90svh] absolute z-[99999999999] top-10 left-1/2 transform -translate-x-1/2  bg-white'>
            <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${animeInfo?.trailer.youtube_id}&?vq=hd720`}
                      width="100%"
                      height="100%"
                      playing={false}
                      muted={false}
                      loop={true}
                      controls={false}
                      // className="absolute top-0 left-0"
                      />
            </div>
        </main>
        )
    }

  return (
  <main className='w-full grid grid-cols-13 h-fit bg-[#141414] relative overflow-x-hidden'>
    {showTrailer && <TrailerPlayer />}
    {
        animeInfo ?
        <div className='w-full col-span-13 xl:col-span-10 h-fit bg-[#141414] py-20 px-5 flex flex-col gap-5'>
            {/* Top Section */}
            <div className='flex-none h-full flex gap-2'>
                <div className='w-[200px]'>
                    <img src={animeInfo?.images?.jpg.image_url} alt={animeInfo?.title_english || animeInfo?.title} className='w-full h-full object-cover rounded-lg' />
                </div>
                <div className='flex-1 h-full  flex flex-col gap-2 px-2'>
                    <div className='w-full flex justify-between'>
                        <h1 className='text-white text-3xl font-bold'>{animeInfo?.title_english || animeInfo?.title}</h1>
                        <div>
                            <button onClick={()=>{setShowTrailer(true)}} className='text-white whitespace-nowrap text-sm md:text-base px-3 py-2 bg-pink-600 rounded font-medium cursor-pointer hover:bg-pink-500'>Watch Trailer</button>
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
                    <div className='w-full h-full grid grid-cols-2'>
                        <div className='h-full w-full'>
                            <ul className='h-full gap-1 flex flex-col justify-between'>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Score: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.score || 0}</h1>
                                    <h1 className='text-gray-400 line-clamp-1'>By {animeInfo?.scored_by ? animeInfo?.scored_by.toLocaleString() : 0} users</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Premiered: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.season ? animeInfo?.season[0].toUpperCase()+animeInfo?.season.substring(1) : '???'} {animeInfo?.year || '???'}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Date Aired: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>
                                        {
                                            new Date(animeInfo?.aired?.from || new Date()).toLocaleDateString('en-us', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) + ' '
                                        } 
                                         to  
                                        {
                                            ' ' + new Date(animeInfo?.aired?.to || new Date()).toLocaleDateString('en-us', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                        }
                                    </h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Status: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.airing ? 'Ongoing' : 'Finished'}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Episodes: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.episodes || '????'}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Duration: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.duration}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Genre: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.genres.map((genre)=> genre.name).join(', ')}</h1>
                                </li>
                            </ul>
                        </div>
                        <div className='h-full w-full'>
                            <ul className='h-full flex flex-col gap-1 justify-start gap-2'>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Studios: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>{animeInfo?.studios.map((studio)=> studio.name).join(', ')}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px]  font-medium'>Producers: </h1>
                                    <h1 className='text-gray-200 line-clamp-2 ps-2'>{animeInfo?.producers.map((producer)=> producer.name).join(', ')}</h1>
                                </li>
                                <li className='flex gap-2'>
                                    <h1 className='text-gray-400 w-[80px] font-medium'>Source: </h1>
                                    <h1 className='text-gray-200 line-clamp-1'>
                                        {animeInfo?.source}
                                    </h1>
                                </li>
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
                        <h1 className='text-white text-2xl font-bold'>Synopsis</h1>
                        <p className='text-white text-base'>{animeInfo?.synopsis.replace('[Written by MAL Rewrite]', '')}
                        
                        </p>
                    </div>
                </div>
            </div>
            {/* Characters */}
            <div className='w-full  h-fit flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-2xl font-bold'>Characters</h1>
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
                className="w-full h-fit mx-auto "
                >
                {characters?.length > 0 &&
                characters.map((char, index, array) =>
                {
                    return (
                    <div className='relative'>
                    <SwiperSlide
                    key={index}
                    onMouseEnter={()=>{setTimeout(()=>{setHovered(index)}, 150)}}
                    onMouseLeave={()=>{setTimeout(()=>{setHovered(-1)}, 150)}}
                    style={{ width: '195px', height: 'auto' }} // or use fixed or dynamic width based on screen
                    className={`peer-hover:rotate-y-180 transform duration-300 ease-in-out delay-75 h-full md:h-[40svh] px-0 flex items-center justify-center rounded-lg cursor-pointer`}
                    >
                        <div className='w-full h-full top-0 absolute bg-transparent peer z-[9999999999999]'></div>
                    <div className={`peer-hover:rotate-y-180 transform duration-300 ease-in-out delay-75 relative h-fit overflow-hidden rounded-lg`}>
                    <div className={`${hovered == index ? 'rotate-y-180' : ''} w-fit flex items-center absolute z-[999] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-1`}>
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
                        <div className={`${hovered == index ? 'rotate-y-180' : ''} w-full absolute px-1 md:px-3 py-1 bottom-0 bg-transparent backdrop-blur-xl h-[30%] xs:h-[25%] md:h-[25%] rounded-b-lg flex`}>
                        <div className="flex flex-col items-start w-full h-full justify-around">
                            <h2 className="text-white text-sm md:text-base w-full line-clamp-1">
                            {char?.character?.name}
                            </h2>
                            <h2 className="text-gray-300 text-xs md:text-sm line-clamp-1">
                            {char?.voice_actors[0]?.person?.name}
                            </h2>
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
                    <h1 className='text-white text-2xl font-bold'>Related</h1>
                </div>
                {
                    animeRelations.length == 0 &&
                    <div className='w-full h-full flex justify-center items-center'>
                        <h1 className='text-gray-500 text-2xl'>No Related Anime</h1>
                    </div>
                }
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
                {animeRelations.length > 0 &&
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
                </div>                       
            </div>
            {/* Reviews */}
            <div className='w-full flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-2xl font-bold'>Reviews</h1>
                </div>
                {
                    reviews?.length == 0 &&
                    <div className='w-full h-full flex justify-center items-center'>
                        <h1 className='text-gray-500 text-2xl'>No Reviews</h1>
                    </div>
                }
                <div className='w-full h-full flex flex-col gap-2'>
                    {
                        reviews?.length > 0 &&
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
            }
        </div>
  </main>
  )
}

export default AnimeOverView