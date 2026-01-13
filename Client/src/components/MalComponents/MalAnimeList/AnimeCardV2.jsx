import React, { useEffect, useState } from 'react'
import {Calendar, Minus, Pencil, Plus, Save, Star} from 'lucide-react'
import StatusDrodown from './StatusDrodown'
import http from '../../../http'
import ScorePicker from './ScorePicker'
import { useNavigate, useParams } from 'react-router-dom'
import AnimeUpdateModal from './AnimeUpdateModal'
import useUserAnimeStore from '../../../stores/UserAnimeStore.js'
import LoaderV2 from '../../LoaderV2.jsx'

const AnimeCardV2 = ({anime, animeInfo}) => {
  const {status} = useParams()
  const navigate = useNavigate()
  const [score, setScore] = useState(animeInfo.score)
  const [selectedWatchStatus, setSelectedWatchStatus] = useState(status)
  const [rerender, setRerender] = useState(1)
  const animeStatuses = useUserAnimeStore((s) => s.animeStatuses)
  const [epStatus, setEpStatus] = useState(animeInfo.num_episodes_watched || 0)
  const [isOpen, setIsOpen] = useState(false)
  let total_ep = anime.num_episodes || '??'

  const handleUpdate = async () => {
    const payload = {
      id: anime.id,
      num_watched_episodes: epStatus,
      score,
      status: selectedWatchStatus
    }

    try {
      const response = await http.post(`mal/anime`, payload);
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }

  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400"
          />
        );
      } else {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-amber-400" />
        );
      }
    }
    return stars;
  };

  const formatTimeLeft = (seconds) => {
    if (typeof seconds !== 'number') return "";
    if(seconds === 0) return 'Airing'
    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
  
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
        
        setRerender(rerender + 1)
      }
    }
  },[anime, animeStatuses])

  return (
    <div className="anime-card bg-themeDarker rounded-lg group overflow-hidden relative h-full flex flex-col">
        {/* Edit button */}
        <button
            onClick={(e) => {e.stopPropagation();setIsOpen(true)}}
            className="cursor-pointer z-90 absolute top-2 right-2 p-2 rounded-lg backdrop-blur-md bg-themeDark/60  hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
            <Pencil className="w-4 h-4 text-gray-300" />
        </button>

        {/* Image Container */}
        <div className="flex-none relative aspect-[3/4] overflow-hidden">
            <img
            src={anime.main_picture.large}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
            />

            <div className=" flex items-center gap-1 rounded-full bg-gray-700/50 px-2 py-1 backdrop-blur-sm absolute z-90 top-2 left-2">
                <Star className="h-3 w-3 fill-pink-600 text-pink-600" width={30} />
                <span className="text-xs font-medium text-white">{score}</span>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-themeDark via-themeDarker/5 to-transparent" />

            {/* Episode Progress (if watching) */}
            {status === "watching" && total_ep && epStatus !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${(epStatus / total_ep) * 100}%` }}
                />
            </div>
            )}

            <div className='w-full flex flex-row xs:flex-row justify-start gap-1 absolute bottom-2 left-2'>
              <div className='h-full cursor-default px-1.5 sm:px-3 border border-pink-700 flex justify-center items-center rounded-md bg-pink-600 py-0.5'>
                  <span className='text-gray-100 capitalize text-[0.7rem] sm:text-[0.8rem] text-center'>{selectedWatchStatus.replaceAll("_", " ")}</span>
              </div>
                  {
                    anime.status === 'currently_airing' && 
                    (
                    <div className='h-full cursor-default px-1.5 sm:px-3 justify-center border border-themeDark flex items-center rounded-md bg-themeDark py-0.5'>
                      {
                        anime?.airInfo ? <span className='text-gray-100 capitalize text-[0.7rem] sm:text-[0.8rem] whitespace-nowrap'>{anime?.airInfo}</span>
                        :
                        <LoaderV2 color='bg-white' width={5} height={5} />
                      }
                    </div>
                    )
                  }
            </div>
        </div>

        {/* Content */}
        <div className=" h-full p-2 sm:p-4 space-y-3 ">
          {/* Title */}
          <h3 className="flex-1 text-sm sm:text-base font-display font-semibold text-gray-100 line-clamp-2 sm:line-clamp-1 leading-tight">
          {anime.title}
          </h3>
          {/* Score */}
          {/* <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-0.5">{renderStars(score)}</div>
          <span className="text-sm font-medium text-gray-100">{score}</span>
          </div> */}

          {/* Aired Date */}
          <div className="flex items-center gap-2 ">
            <Calendar className="hidden sm:block w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-400 mt-[2px]">{anime.start_date ? new Date(anime.start_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '????-??-??'} - {anime.end_date ? new Date(anime.end_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '??-??-??'}</span>
          </div>

          {/* Episodes Info */}
          {total_ep && (
          <p className="text-sm text-muted-foreground">
                {epStatus !== undefined ? (
                <>
                    <span className="text-pink-600 font-medium">{epStatus}</span>
                    <span className='text-gray-400'> / {total_ep} episodes</span>
                </>
                ) : (
                <span>{total_ep} episodes</span>
                )}
          </p>
          )}

        </div>
        

        {/* Edit Modal */}
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
        handleUpdate={handleUpdate}
        anime={anime} />}
    </div>
  )
}

export default AnimeCardV2