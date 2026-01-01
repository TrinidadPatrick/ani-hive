import React from 'react'
import AnimeRecommendationProvider from '../../providers_tmp/AnimeRecommendationProvider'

const AnimeRecommendation = () => {

  const {animeRecommendation} = AnimeRecommendationProvider()

  console.log(animeRecommendation)
  return (
    <div>AnimeRecommendation</div>
  )
}

export default AnimeRecommendation