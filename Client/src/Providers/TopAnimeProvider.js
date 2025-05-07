import React, { useEffect } from 'react'
import topAnimeStore from '../Store/topAnimeStore'
import axios from 'axios'

const TopAnimeProvider = () => {
    const topAnimes = topAnimeStore((state) => state.topAnimes);
    const s_setTopAnimes = topAnimeStore((state) => state.s_setTopAnimes);

    const getTopAnimes = async (page) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page || 1}`)
            if(result.status === 200) {
                s_setTopAnimes(result.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(topAnimes === null) {
            getTopAnimes()
        }
    }, [])

    return {
        topAnimes,
        getTopAnimes
    }
}

export default TopAnimeProvider