import React from 'react'

const Pictures = ({content}) => {
  return (
    <div className='grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-2'>
        {
            content.length > 0 &&
            content.map((picture, index) => {
                return (
                    <div className='rounded-lg overflow-hidden'>
                        <img src={picture?.jpg?.image_url} className='w-full h-full object-cover border-0' />
                    </div>
                )
            })
        }
    </div>
  )
}

export default Pictures