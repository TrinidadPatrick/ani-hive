import React, { useEffect } from 'react'
import topAnimeStore from '../stores/topAnimeStore'
import axios from 'axios'
import localforage from "localforage";

const TopAnimeProvider = () => {
    const topAnimes = topAnimeStore((state) => state.topAnimes);
    const s_setTopAnimes = topAnimeStore((state) => state.s_setTopAnimes);

    const getTopAnimes = async (page, retires = 10) => {
        const cachedList = await localforage.getItem('topAnimes');
        s_setTopAnimes(cachedList)
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page || 1}`)
            if(result.status === 200) {
                s_setTopAnimes(result.data)
            }
            await localforage.setItem('topAnimes', result.data);
        } catch (error) {
            console.log(error)
            if(retires > 0)
            {
                setTimeout(()=>{
                    getTopAnimes(1, retires - 1)
                }, 1000)
            }
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