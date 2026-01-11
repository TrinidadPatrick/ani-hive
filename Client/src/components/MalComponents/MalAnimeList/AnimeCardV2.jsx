import React, { useState } from 'react'
import {Calendar, Minus, Pencil, Plus, Save, Star} from 'lucide-react'
import StatusDrodown from './StatusDrodown'
import http from '../../../http'
import ScorePicker from './ScorePicker'
import { useNavigate, useParams } from 'react-router-dom'
import AnimeUpdateModal from './AnimeUpdateModal'

const AnimeCardV2 = ({anime, animeInfo}) => {
  const {status} = useParams()
  const navigate = useNavigate()
  const [score, setScore] = useState(animeInfo.score)
  const [selectedWatchStatus, setSelectedWatchStatus] = useState(status)
  const [epStatus, setEpStatus] = useState(animeInfo.num_episodes_watched || 0)
  const [isOpen, setIsOpen] = useState(false)
  let total_ep = anime.num_episodes || '??'

  const handleIncrement = (e) => {
    e.stopPropagation()
    setEpStatus((prev) => (prev < total_ep ? prev + 1 : prev))
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    setEpStatus((prev) => (prev > 0 ? prev - 1 : prev))
  }

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

  return (
    <div className="anime-card bg-themeDark rounded-lg group overflow-hidden relative h-full flex flex-col">
        {/* Edit button */}
        <button
            onClick={(e) => {e.stopPropagation();setIsOpen(true)}}
            className="cursor-pointer z-90 absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md bg-themeDark/60  hover:bg-primary hover:text-primary-foreground transition-all duration-200"
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
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-themeDark via-themeDarkest/5 to-transparent" />

            {/* Episode Progress (if watching) */}
            {status === "watching" && total_ep && epStatus !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${(epStatus / total_ep) * 100}%` }}
                />
            </div>
            )}
        </div>

        {/* Content */}
        <div className=" h-full p-2 sm:p-4 space-y-3 ">
            {/* Title */}
            <h3 className="flex-1 text-sm sm:text-base font-display font-semibold text-gray-100 line-clamp-2 sm:line-clamp-1 leading-tight">
            {anime.title}
            </h3>

            {/* Score */}
            <div className="flex items-center gap-2 ">
            <div className="flex items-center gap-0.5">{renderStars(score)}</div>
            <span className="text-sm font-medium text-gray-100">{score}</span>
            </div>

            {/* Aired Date */}
            <div className="flex items-center gap-2 ">
            <Calendar className="hidden sm:block w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-400 mt-[2px]">{anime.start_date ? new Date(anime.start_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '????-??-??'} - {anime.end_date ? new Date(anime.end_date).toLocaleDateString('US', {year: 'numeric', month: 'short'}) : '??-??-??'}</span>
            </div>

            {/* <div className="flex items-center justify-between bg-themeDarker rounded-lg p-2">
                <button
                onClick={handleDecrement}
                disabled={epStatus <= 0}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-themeDark border-gray-700 border cursor-pointer hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                <Minus className="w-3.5 h-3.5 text-gray-100" />
                </button>
                <div className="text-center">
                <span className="text-sm text-gray-100 font-bold">{epStatus}</span>
                <span className="text-xs text-gray-400"> / {total_ep}</span>
                </div>
                <button
                onClick={handleIncrement}
                disabled={epStatus >= total_ep}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-themeDark border-gray-700 border cursor-pointer hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                <Plus className="w-3.5 h-3.5 text-gray-100" />
                </button>
            </div> */}

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