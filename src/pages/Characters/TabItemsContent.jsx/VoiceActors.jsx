import React from 'react'

const VoiceActors = ({content}) => {
  return (
    <div className='grid grid-cols-2'>
        {
            content.length > 0 &&
            content.map((actor, index) => {
                console.log(actor)
                return (
                    <div className='flex gap-2'>
                        {/* Image container */}
                        <div className='w-10 h-10 rounded-full overflow-hidden'>
                            <img src={actor.person.images.jpg.image_url} className='w-full h-full object-cover object-center' />
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default VoiceActors