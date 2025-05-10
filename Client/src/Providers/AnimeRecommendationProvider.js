import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AnimeRecommendationProvider = () => {

  const [animeRecommendation, setAnimeRecommendation] = useState(null)

  const getAnimeRecommendation = async (page, retries = 10) => {
    try {
        const result = await axios.get(`https://api.jikan.moe/v4/recommendations/anime?page=${page || 1}&limit=25`)
        if(result.status === 200) {
            const animes = result.data.data
            const list = animes.map((anime)=>anime.entry)
            const final_list = list.flat()
            setAnimeRecommendation(animes)
        }
    } catch (error) {
        console.log(error)
        if(retries > 0)
        {
            setTimeout(()=>{
                getAnimeRecommendation(1, retries - 1)
            }, 1000)
        }
    }
  }


  useEffect(() => {
    getAnimeRecommendation()
  }, [])

  return {
    animeRecommendation
  }
}

export default AnimeRecommendationProvider