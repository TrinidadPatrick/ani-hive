import React from 'react'
import { useNavigate } from 'react-router-dom'

const VoiceActors = ({content}) => {
    const navigate = useNavigate()

    return (
        <div className='grid grid-cols-2 gap-2'>
            {
                content.length > 0 &&
                content.map((actor, index) => {
                    return (
                        <div onClick={() => navigate(`/voice-actor/${actor?.person?.mal_id}`)} key={index} className='flex gap-2 cursor-pointer'>
                            {/* Image container */}
                            <div className='w-10 h-10 rounded-full overflow-hidden'>
                                <img src={actor?.person?.images?.jpg?.image_url} className='w-full h-full object-cover object-center' />
                            </div>
                            {/* Name and language */}
                            <div className='flex-1 flex flex-col'>
                                <span className='text-gray-200 text-sm sm:text-base'>{actor?.person?.name}</span>
                                <span className='text-gray-400 text-xs sm:text-sm'>{actor?.language}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default VoiceActors