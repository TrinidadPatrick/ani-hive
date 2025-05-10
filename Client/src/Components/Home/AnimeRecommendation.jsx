import React from 'react'
import AnimeRecommendationProvider from '../../Providers/AnimeRecommendationProvider'

const AnimeRecommendation = () => {

  const {animeRecommendation} = AnimeRecommendationProvider()

  console.log(animeRecommendation)
  return (
    <div>AnimeRecommendation</div>
  )
}

export default AnimeRecommendation