import {create} from 'zustand'
import http from '../http.js'

const useUserAnimeStore = create((set, get) => ({
    isFetching: false,
    watching: null,
    completed: null,
    on_hold: null,
    dropped: null,
    plan_to_watch: null,

    isUpdating: false,

    getList: async (status, offset = 0, isFetching = true) => {
        try {
            set({isFetching: get()[status] === null})
            const response = await http.get(`mal/anime/${status}?offset=${offset}`)
            const animeList = response.data.data
            const nextPageLink = response.data.paging.next
            set({[status] : {
                animeList: animeList,
                nextPageLink: nextPageLink || ''
            }}) 
        } catch (error) {
            console.log(error)
        } finally {
            set({isFetching: false})
        }
    },

    updateAnime: async ({id, num_watched_episodes, score, status}) => {
        set({isUpdating: true})
        const payload = {
            id,
            num_watched_episodes,
            score,
            status
          }

          try {
            const response = await http.post(`mal/anime`, payload);
            return response
          } catch (error) {
            console.log(error)
          } finally {
            set({isUpdating: false})
          }
    }

}))

export default useUserAnimeStore