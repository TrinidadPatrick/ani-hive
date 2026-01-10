import {create} from 'zustand'
import http from '../http.js'

const useUserAnimeStore = create((set, get) => ({
    isFetching: false,
    watching: null,
    completed: null,
    on_hold: null,
    dropped: null,
    plan_to_watch: null,


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

}))

export default useUserAnimeStore