import React, {useEffect} from 'react'
import AnimeMoviesStore from '../stores/AnimeMoviesStore'
import axios from 'axios'
import SeasonNowAnimeStore from '../stores/SeasonNowAnimeStore'
import localforage from 'localforage'

const AnimeMoviesProvider = () => {
    const SeasonNowAnime = SeasonNowAnimeStore((state) => state.SeasonNowAnime)
    const AnimeMovies = AnimeMoviesStore((state) => state.AnimeMovies)
    const s_setAnimeMovies = AnimeMoviesStore((state) => state.s_setAnimeMovies)

    const getAnimeMovies = async (page, retries = 10) => {
      const cachedList = await localforage.getItem('animeMovies');
      if(cachedList) s_setAnimeMovies(cachedList)
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime?type=movie&order_by=popularity&sort=asc&page=${page || 1}`)
            if(result.status === 200) {
                const animes = result.data.data
                s_setAnimeMovies(animes)
                await localforage.setItem('animeMovies', animes);
            }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getAnimeMovies(1, retries - 1)
                }, 1000)
            }
        }
    }

  useEffect(() => {
    if(AnimeMovies == null && SeasonNowAnime != null) {
      setTimeout(()=>{
        getAnimeMovies()
      }, 500)
    }
  }, [SeasonNowAnime])

  return {
    AnimeMovies,getAnimeMovies
  }
}

export default AnimeMoviesProvider