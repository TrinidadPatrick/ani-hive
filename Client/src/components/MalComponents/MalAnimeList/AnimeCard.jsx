import React, { useState } from 'react'
import {Minus, Plus, Save, Star} from 'lucide-react'
import StatusDrodown from './StatusDrodown'
import http from '../../../http'
import ScorePicker from './ScorePicker'
import { useNavigate, useParams } from 'react-router-dom'

const AnimeCard = ({anime, animeInfo}) => {
  const {status} = useParams()
  const navigate = useNavigate()
  const [score, setScore] = useState(animeInfo.score)
  const [selectedWatchStatus, setSelectedWatchStatus] = useState(status)
  const [epStatus, setEpStatus] = useState(animeInfo.num_episodes_watched || 0)
  let total_ep = anime.num_episodes || '??'

  const handleIncrement = () => {
    setEpStatus((prev) => (prev < total_ep ? prev + 1 : prev))
  }

  const handleDecrement = () => {
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

  return (
    <div onClick={()=>{navigate(`/anime/${anime.id}`)}} className='anime_card cursor-pointer flex gap-3 relative border border-gray-800/20 justify-start p-4 bg-[#1b1b1b] rounded-lg'>
      {/* Image Contianer */}
      <div className='overflow-hidden flex-none w-20 aspect-[2/2] lg:w-22 bg-white rounded-md'>
        <img src={anime.main_picture.medium} className='w-full h-full object-cover object-center brightness-75' />
      </div>

      {/* Info Container */}
      <div className='flex-1 flex flex-col justify-between'>
        {/* Title & date air*/}
        <div className='title_date_container'>
          <div className='title_score_container flex items-center '>
            <h2 className='text-white font-bold line-clamp-1 w-full'>{anime.title}</h2>
          </div>
          {/* Start and End Date */}
          <h5 className='text-gray-300 font-normal line-clamp-1'>{anime.start_date || '????-??-??'} - {anime.end_date || '????-??-??'}</h5>
        </div>

        {/* Episode progress bar */}
        <div className='flex flex-col items-end gap-0 my-2'>
          <div className="w-fit flex items-center py-1.5">
            <button
              onClick={(e)=>{e.stopPropagation();handleDecrement()}}
              className=" cursor-pointer flex h-6 w-6 items-center justify-center bg-[#25252D] rounded-full text-xs  hover:bg-blue-500 text-white"
            >
              <Minus className='text-white' width={15} />
            </button>
            <div className="min-w-[60px] text-center text-sm font-semibold text-white">
              <span>{epStatus}</span> / <span className='text-gray-400'>{total_ep}</span>
            </div>
            <button
              onClick={(e)=>{e.stopPropagation();handleIncrement()}}
              className=" cursor-pointer flex h-6 w-6 items-center justify-center bg-[#25252D] rounded-full text-xs hover:bg-blue-500 text-white"
            >
              <Plus className='text-white' width={15} />
            </button>
          </div>
        <div className="w-full bg-[#25252D] rounded-full">
          <div className="bg-pink-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full h-3 flex items-center justify-center" style={{width: `${(epStatus / total_ep) * 100}%`}} />
        </div>
        </div>

        {/* Watch status, ep status, and update btn */}
        <div className='flex gap-2 items-center h-9'>
          {/* Ratingf */}
          <ScorePicker score={score} setScore={setScore} />
  
          {/* Watch Status */}
          <StatusDrodown selectedWatchStatus={selectedWatchStatus} setSelectedWatchStatus={setSelectedWatchStatus} anime={anime} />

          {/* Update btn */}
          <button onClick={(e)=>{e.stopPropagation();handleUpdate()}} title='update' className='bg-pink-600 hover:bg-pink-500 cursor-pointer px-2 rounded-lg h-full'>
            <Save width={20} className='text-white' />
          </button>
        </div>

      </div>

      {/* Badge */}
      {/* <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gray-700/50 px-2 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-pink-600 text-pink-600" width={30} />
          <span className="text-xs font-medium text-white">{animeInfo.score}</span>
      </div> */}
    </div>
  )
}

export default AnimeCard