import React, { useEffect, useMemo, useState } from 'react'
import {Minus, Pencil, Plus, Save, Star} from 'lucide-react'
import StatusDrodown from './StatusDrodown'
import http from '../../../http'
import ScorePicker from './ScorePicker'
import { useNavigate, useParams } from 'react-router-dom'
import AnimeUpdateModal from './AnimeUpdateModal.jsx'
import useUserAnimeStore from '../../../stores/UserAnimeStore.js'
import LoaderV2 from '../../LoaderV2.jsx'

const AnimeCard = ({anime, animeInfo}) => {
  const [rerender, setRerender] = useState(1)
  const animeStatuses = useUserAnimeStore((s) => s.animeStatuses)
  const {status} = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [score, setScore] = useState(animeInfo.score)
  const [selectedWatchStatus, setSelectedWatchStatus] = useState(status)
  const [epStatus, setEpStatus] = useState(animeInfo.num_episodes_watched || 0)
  let total_ep = anime.num_episodes || '??'

  const formatTimeLeft = (seconds) => {
    if (typeof seconds !== 'number') return "";
    if(seconds === 0) return 'Airing'
    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (days > 0 && hours <= 0) return `${days}d`;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  useEffect(() => {
    if(anime && animeStatuses.length !== 0){
      if(anime.status === 'currently_airing'){
        const airedEps = animeStatuses.find((status) => status.idMal === anime.id)?.nextAiringEpisode

        const formatted = formatTimeLeft(airedEps?.timeUntilAiring || 0 )
        const ep = airedEps?.episode
        anime.airInfo = !airedEps?.timeUntilAiring ? 'Airing' : `EP ${ep} in ${formatted}`
        anime.currentEps = airedEps?.episode - 1 || 0
        
        setRerender(rerender + 1)
      }
    }
  },[anime, animeStatuses])

  return (
    <div className='anime_card cursor-pointer flex gap-3 relative border border-gray-800/20 justify-start p-2 sm:p-4 bg-themeDarker rounded-lg'>
      {/* Image Contianer */}
      <div className='overflow-hidden flex-none w-20 aspect-[2/2] lg:w-22 bg-white rounded-md'>
        <img src={anime.main_picture.medium} className='w-full h-full object-cover object-center brightness-75' />
      </div>

      {/* Info Container */}
      <div className='flex-1 flex flex-col justify-between overflow-visible'>
        {/* Title & date air*/}
        <div className='title_date_container'>
          <div className='title_score_container flex items-center '>
            <h2 className='text-white font-bold line-clamp-1 w-full'>{anime.title}</h2>
            {/* Badge */}
            <div className=" flex items-center gap-1 rounded-full bg-gray-700/50 px-2 py-1 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-pink-600 text-pink-600" width={30} />
                <span className="text-xs font-medium text-white">{score}</span>
            </div>
          </div>
          {/* Start and End Date */}
          <span className="text-sm text-gray-400 mt-[2px]">{anime.start_date ? new Date(anime.start_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '????-??-??'} - {anime.end_date ? new Date(anime.end_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '??-??-??'}</span>
        </div>

        {/* Episode progress bar */}
        <div className='flex items-center gap-0 my-2'>
        <div className="w-full bg-[#25252D] rounded-full mt-0.5">
          <div className="bg-pink-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full h-2 flex items-center justify-center" style={{width: `${(epStatus / (anime.currentEps || total_ep)) * 100}%`}} />
        </div>
        <div className="w-fit flex items-center py-1.5">
            <div className="min-w-[60px] text-center text-sm font-semibold text-white">
              {
                anime.status === 'currently_airing' ?
                (
                  <span>{epStatus} / <span className='text-gray-400'> { anime.currentEps || '??'}</span> <span className='text-gray-400'> / {total_ep}</span> </span>
                )
                :
                (
                  <span>{epStatus} / <span className='text-gray-400'>{total_ep}</span> </span>
                )
              }
            </div>
          </div>
        </div>

        {/* Watch status, ep status, and update btn */}
        <div className='flex gap-2 items-center h-8 overflow-visible'>
  
          {/* Watch Status */}
          <div className='h-full cursor-default px-3 border border-themeDark flex items-center rounded-md bg-themeDark'>
            <span className='text-gray-100 capitalize text-[0.8rem]'>{selectedWatchStatus.replaceAll("_", " ")}</span>
          </div>
          {
            anime.status === 'currently_airing' && 
            (
            <div className='h-full cursor-default min-w-23 justify-center border border-themeDark flex items-center rounded-md bg-themeDark'>
              {
                anime?.airInfo ? <span className='text-gray-100 capitalize text-[0.8rem]'>{anime?.airInfo}</span>
                :
                <LoaderV2 color='bg-white' width={5} height={5} />
              }
            </div>
            )
          }

          {/* Update btn */}
          <button onClick={(e)=>{e.stopPropagation();setIsOpen(true)}} title='update' className='bg-pink-600 hover:bg-pink-500 cursor-pointer px-2.5 rounded-md h-full'>
            <Pencil width={17} className='text-white' />
          </button>
        </div>

      </div>
      { isOpen && 
        <AnimeUpdateModal 
        isOpen={isOpen}
        setIsOpen={setIsOpen} 
        score={score}
        setScore={setScore} 
        selectedWatchStatus={selectedWatchStatus} 
        setSelectedWatchStatus={setSelectedWatchStatus} 
        epStatus={epStatus}
        setEpStatus={setEpStatus}
        total_ep={total_ep}
        anime={anime} />}

    </div>
  )
}

export default AnimeCard