import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useSmallScreen from '../../utils/useSmallScreen';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
const Characters = ({ mal_id }) => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const isSmallScreen = useSmallScreen()

    const [characters, setCharacters] = useState(null)
    const [hovered, setHovered] = useState(-1)
    const [showOverlayIndex, setShowOverlayIndex] = useState(-1)

    const va = searchParams.get('va') || ''

    const getCharacters = async (mal_id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/characters`)
            if (result.status === 200) {
                const characters = result.data.data
                const sortedCharacters = characters.sort((a, b) => b.favorites - a.favorites)
                setCharacters(sortedCharacters)
            }
        } catch (error) {
            console.log(error)
            if (retries > 0) {
                setTimeout(() => {
                    getCharacters(mal_id, retries - 1)
                }, 1000)
            }
        }
    }

    useEffect(() => {
        if (mal_id) {
            getCharacters(mal_id)
        }
    }, [mal_id])

    return (
        <div className='w-full  h-fit flex flex-col gap-3'>
            <div>
                <h1 className='text-white text-xl md:text-2xl font-bold'>Characters</h1>
            </div>
            <div className='relative w-full '>
                <div className="flex w-full overflow-x-auto pb-2 gap-3 snap-x hover-scrollbar">
                        {characters?.length > 0 &&
                            characters.map((char, index, array) => {
                                const isFlipped = hovered === index;
                                const hasVA = char?.voice_actors && char.voice_actors.length > 0;
                                
                                return (
                                    <div 
                                        key={index} 
                                        style={{ perspective: 1000 }}
                                        className='relative w-[130px] sm:w-[135px] md:w-[180px] lg:w-[195px] shrink-0 snap-start h-full md:h-fit'
                                    >
                                        <motion.div
                                            onMouseEnter={() => { 
                                                if (!isSmallScreen) {
                                                    setHovered(index);
                                                    setShowOverlayIndex(index);
                                                }
                                            }}
                                            onMouseLeave={() => { 
                                                if (!isSmallScreen) {
                                                    setHovered(-1);
                                                    setShowOverlayIndex(-1);
                                                }
                                            }}
                                            onClick={() => { 
                                                if (isSmallScreen) {
                                                    if (!isFlipped) {
                                                        setHovered(index);
                                                        setShowOverlayIndex(-1);
                                                    } else {
                                                        if (showOverlayIndex === index) {
                                                            setShowOverlayIndex(-1);
                                                            setHovered(-1);
                                                        } else {
                                                            setShowOverlayIndex(index);
                                                        }
                                                    }
                                                }
                                            }}
                                            animate={{ rotateY: isFlipped && hasVA ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                            className="w-full h-full relative cursor-pointer"
                                        >
                                            <div className={`${char.character.mal_id == va ? 'border-2 border-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]' : ''} w-full h-full absolute inset-0 z-10 rounded-lg pointer-events-none`}></div>
                                            
                                            {/* FRONT */}
                                            <div 
                                                style={{ backfaceVisibility: 'hidden' }}
                                                className="w-full h-fit flex flex-col items-center justify-center rounded-lg relative overflow-hidden"
                                            >
                                                <div className="w-fit flex items-center absolute z-[99] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-1">
                                                    <div className="w-full h-full bg-black opacity-55 absolute left-0 top-0"></div>
                                                    <p className="z-[999] mt-[1px] text-xs sm:text-sm">{char?.role}</p>
                                                </div>
                                                
                                                {/* Image */}
                                                <div className="w-full h-fit rounded-lg overflow-hidden shadow-lg">
                                                    <img
                                                        src={char?.character?.images?.jpg?.image_url}
                                                        alt={char?.character?.name}
                                                        className="w-full aspect-[2/2.8] object-cover brightness-70"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="w-full absolute px-1 md:px-3 py-1 bottom-0 bg-transparent backdrop-blur-xl rounded-b-lg flex z-[99]">
                                                    <div className="flex flex-col items-start w-full h-full justify-around">
                                                        <h2 className="text-white text-sm md:text-base w-full line-clamp-1">
                                                            {char?.character?.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* BACK */}
                                            {hasVA && (
                                                <div 
                                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', WebkitBackfaceVisibility: 'hidden' }}
                                                    className="w-full h-full flex flex-col items-center justify-center rounded-lg absolute inset-0 overflow-hidden"
                                                >
                                                    <div className="w-fit flex items-center absolute z-[99] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-1">
                                                        <div className="w-full h-full bg-black opacity-55 absolute left-0 top-0"></div>
                                                        <p className="z-[999] mt-[1px] text-xs sm:text-sm">VA</p>
                                                    </div>
                                                    
                                                    {/* Image */}
                                                    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
                                                        <img
                                                            src={char.voice_actors[0].person.images.jpg.image_url}
                                                            alt={char.voice_actors[0].person.name}
                                                            className="w-full aspect-[2/2.8] object-cover brightness-70"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="w-full absolute px-1 md:px-3 py-1 bottom-0 bg-transparent backdrop-blur-xl rounded-b-lg flex z-[99]">
                                                        <div className="flex flex-col items-start w-full h-full justify-around">
                                                            <h2 className="text-white text-xs md:text-sm line-clamp-1">
                                                                {char.voice_actors[0].person.name}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    {/* Mobile Overlay */}
                                                    <div className={`absolute inset-0 bg-black/60 z-[100] flex items-center justify-center transition-opacity duration-300 `}>
                                                        <button 
                                                            className="bg-pink-600 cursor-pointer hover:bg-pink-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-semibold shadow-lg transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/voice-actor/${char?.voice_actors[0]?.person?.mal_id}`)
                                                            }}
                                                        >
                                                            View VA Info
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                        </motion.div>
                                    </div>
                                )
                            })
                        }
                </div>
            </div>
        </div>
    )
}

export default Characters