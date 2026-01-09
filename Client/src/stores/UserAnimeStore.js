import {create} from 'zustand'
import http from '../http.js'

const useUserAnimeStore = create((set, get) => ({
    isFetching: false,
    watching: null,
    completed: null,
    on_hold: null,
    dropped: null,
    plan_to_watch: null,

    getList: async (status) => {
        try {
            set({isFinite: true})
            const response = await http.get(`mal/anime/${status}`)
            console.log(response.data)
            // set({profile: response.data, authenticated: true})
        } catch (error) {
            console.log(error)
            if(error.status === 401){
                set({authenticated: false})
            }
        } finally {
            set({isFetching: false})
        }
    },

}))

export default useUserAnimeStore