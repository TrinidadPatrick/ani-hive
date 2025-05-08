import axios from 'axios'
import React, { useEffect } from 'react'
import SeasonNowAnimeStore from '../Store/SeasonNowAnimeStore'

const SeasonNowAnimeProvider = () => {
    const SeasonNowAnime = SeasonNowAnimeStore((state) => state.SeasonNowAnime);
    const s_setSeasonNowAnime = SeasonNowAnimeStore((state) => state.s_setSeasonNowAnime);

  const getSeasonNowAnime = async (page) => {
    try {
        const result = await axios.get(`https://api.jikan.moe/v4/seasons/now?page=${page || 1}`)
        if(result.status === 200) {
            const animes = result.data.data
            s_setSeasonNowAnime(animes)
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if(SeasonNowAnime === null) {
      getSeasonNowAnime()
    }
  }, [])


  return {
    SeasonNowAnime,
  }
}

export default SeasonNowAnimeProvider