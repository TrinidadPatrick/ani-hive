import React from 'react'
import AnimeRecommendationProvider from '../../providers/AnimeRecommendationProvider'

const AnimeRecommendation = () => {

  const {animeRecommendation} = AnimeRecommendationProvider()

  console.log(animeRecommendation)
  return (
    <div>AnimeRecommendation</div>
  )
}

export default AnimeRecommendation