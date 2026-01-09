import React from 'react'
import { useParams } from 'react-router-dom'

const AnimeList = () => {
  const {status} = useParams()

  console.log(status)
  return (
    <div>AnimeList</div>
  )
}

export default AnimeList