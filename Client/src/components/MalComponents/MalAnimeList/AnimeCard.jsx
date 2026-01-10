import React from 'react'
import {Star} from 'lucide-react'

const AnimeCard = ({anime, animeInfo}) => {
  console.log(anime)
  return (
    <div className='flex relative bg-red-100'>
      {/* Image Contianer */}
      <div className='aspect-[2/3] overflow-hidden'>
        <img src={anime.main_picture.medium} className='w-full h-full bg-cover bg-center' />
      </div>

      {/* Badge */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-medium">{animeInfo.score.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default AnimeCard