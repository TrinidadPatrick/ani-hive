import axios from 'axios'
import React, { useEffect } from 'react'
import SeasonNowAnimeStore from '../stores/SeasonNowAnimeStore'
import localforage from 'localforage';


const SeasonNowAnimeProvider = () => {
    const SeasonNowAnime = SeasonNowAnimeStore((state) => state.SeasonNowAnime);
    const s_setSeasonNowAnime = SeasonNowAnimeStore((state) => state.s_setSeasonNowAnime);

  const getSeasonNowAnime = async (page, retries = 10) => {
    const cachedList = await localforage.getItem('seasonNowAnime');
    s_setSeasonNowAnime(cachedList)
    try {
        const result = await axios.get(`https://api.jikan.moe/v4/seasons/now?page=${page || 1}`)
        if(result.status === 200) {
            const animes = result.data.data
            s_setSeasonNowAnime(animes)
            await localforage.setItem('seasonNowAnime', animes);
        }
    } catch (error) {
        console.log(error)
        if(retries > 0)
        {
            setTimeout(()=>{
                getSeasonNowAnime(1, retries - 1)
            }, 1000)
        }
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