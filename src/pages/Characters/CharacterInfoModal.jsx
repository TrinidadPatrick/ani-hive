import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import axios from 'axios'
import { Film, Image, Info, Mic, PictureInPicture, PictureInPictureIcon, X } from 'lucide-react'
import About from './TabItemsContent.jsx/About.jsx'
import VoiceActors from './TabItemsContent.jsx/VoiceActors.jsx'
import CharacterAnimes from './TabItemsContent.jsx/CharacterAnimes.jsx'
import Pictures from './TabItemsContent.jsx/Pictures.jsx'
import CharacterInfoModalSkeleton from './CharacterInfoModalSkeleton.jsx'

const CharacterInfoModal = ({character, setIsOpen}) => {
    const [characterFullInfo, setCharacterFullInfo] = useState(null)
    const {mal_id} = character

    const getCharacterInfo = async (retries = 10) => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/characters/${mal_id}/full`)
            const pictures = await axios.get(`https://api.jikan.moe/v4/characters/${mal_id}/pictures`)
            const {data} = response.data
            data.pictures = pictures.data.data
            setCharacterFullInfo(data)
        } catch (error) {
            console.log(error)
            if(error.status === 429 && retries > 0){
                getCharacterInfo(retries - 1)
            }
        }
    }

    useEffect(() => {
        getCharacterInfo()
    },[])
    
    return (
        <main onClick={(e) => e.stopPropagation()} className='fixed rounded-lg w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.7)]'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
                }}
                className='bg-themeDarker w-[90%] sm:max-w-4xl border flex flex-col border-themeLightDark rounded-lg shadow-2xl absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            >
                {/* Image container */}
                {
                    characterFullInfo === null ? <CharacterInfoModalSkeleton /> :
                    <>
                    <section className='w-full h-[350px] flex overflow-hidden relative'>
                        <button onClick={()=>setIsOpen(false)} className='absolute z-10 top-1 right-1 p-2 rounded-full bg-themeDarkest/20 hover:bg-themeDark/10 cursor-pointer text-white'><X /></button>
                        <img src={characterFullInfo?.images?.jpg?.image_url} alt={characterFullInfo?.name} className='object-cover w-full brightness-30 blur-xs opacity-50' />
                        <img src={characterFullInfo?.images?.jpg?.image_url} className='w-45 rounded-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                    </section>
                    <Tabs character={characterFullInfo} />
                    </>
                }
            </motion.div>
        </main>
    )
}

const Tabs = ({character}) => {
    const tabItems = [
        {label: 'About', value: 'about', icon: Info},
        {label: 'Voice Actors', value: 'voices', icon: Mic},
        {label: 'Anime', value: 'anime', icon: Film},
        {label: 'Pictures', value: 'pictures', icon: Image}
    ]

    const [selectedTab, setSelectedTab] = useState('about')

    return (
    <section className='flex flex-col'>
        <ul className='w-full flex gap-5 mt-1 p-2 border-b border-themeLightDark items-center'>
            {
                tabItems.map((item, index) => {
                    return (
                        <li key={index} onClick={()=>setSelectedTab(item.value)} className={`${selectedTab === item.value ? 'text-pink-600 font-semibold bg-themeDarkest border-b-2 border-pink-600' : 'text-gray-400'} flex gap-1 items-center`}>
                            <item.icon width={15} />
                            <span className='text-xs sm:text-sm'>{item.label}</span>
                        </li>
                    )
                })
            }
        </ul>
        {character && <TabItems tab={selectedTab} character={character} />}
    </section>
    )
}

const TabItems = ({tab, character}) => {

    return (
    <section className='w-full max-h-[300px] overflow-y-auto scrollbar p-3'>
        {
            tab === 'about' ? <About content={character[tab]} nicknames={character.nicknames} /> :
            tab === 'voices' ? <VoiceActors content={character[tab]} /> :
            tab === 'anime' ? <CharacterAnimes content={character[tab]} /> :
            tab === 'pictures' && <Pictures content={character[tab]} />
        }
    </section>
    )
}

export default CharacterInfoModal