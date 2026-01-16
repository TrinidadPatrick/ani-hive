import React from 'react'
import AnimeInfoNotFound from './AnimeInfoNotFound.jsx'
import ServerError from './ServerError.jsx'

const MainHandler = ({status}) => {
  return (
    <div className='w-full h-screen'>
        {
            status === 404 ? <AnimeInfoNotFound />
            : status === 504 && <ServerError />
        }
    </div>
  )
}

export default MainHandler