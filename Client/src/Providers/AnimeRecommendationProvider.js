import axios from 'axios'
import React, { useEffect } from 'react'

const AnimeRecommendationProvider = () => {

  const getAnimeRecommendation = async (page) => {
    try {
        const result = await axios.get(`https://api.jikan.moe/v4/recommendations/anime?page=${page || 1}`)
        if(result.status === 200) {
            const animes = result.data.data
            const list = animes.map((anime)=>anime.entry)
            const test = list.flat()
            console.log(test)
        }
    } catch (error) {
        console.log(error)
    }
  }


  useEffect(() => {
    // getAnimeRecommendation()
  }, [])

  return {
    getAnimeRecommendation
  }
}

export default AnimeRecommendationProvider