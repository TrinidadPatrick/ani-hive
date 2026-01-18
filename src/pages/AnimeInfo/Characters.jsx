import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useSmallScreen from '../../utils/useSmallScreen';


const Characters = ({mal_id}) => {
    const isSmallScreen = useSmallScreen()

    const [characters, setCharacters] = useState(null)
    const [hovered, setHovered] = useState(-1)

    const prevRef = useRef(null);
    const nextRef = useRef(null);

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

    useEffect(() => {
        if(mal_id){
            getCharacters(mal_id)
        }
    }, [mal_id])

    return (
    <div className='w-full  h-fit flex flex-col gap-3'>
                <div>
                    <h1 className='text-white text-xl md:text-2xl font-bold'>Characters</h1>
                </div>
                <div className='relative'>
                <Swiper
                modules={[FreeMode, Navigation]}
                // freeMode={true}
                spaceBetween={10}
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
                    <p className="z-[9999] mt-[1px] text-xs sm:text-sm">{char?.role}</p>
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
  )
}

export default Characters