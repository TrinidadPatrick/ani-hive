import {create} from 'zustand'
import http from '../http.js'
import {toast} from 'react-toastify'

const handleToast = (type, message) => {
    toast[type](message, {
                position: "bottom-left",
                autoClose: 5000,
                closeOnClick: true,
                progress: undefined,
                theme: "dark",
            });
}

const useUserAnimeStore = create((set, get) => ({
    isFetching: false,
    watching: null,
    completed: null,
    on_hold: null,
    dropped: null,
    plan_to_watch: null,

    isUpdating: false,
    isDeleting: false,

    checkIsSaved: async (id) => {
        try {
            set({isFetching: true})
            const response = await http.get(`mal/anime/check/${id}`)
            const result = response.data
            return result
        } catch (error) {
            console.log(error)
        } finally {
            set({isFetching: false})
        }
    },

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
            if(response.status === 200){
                return response
            }
            handleToast('error', 'Something went wrong');
          } catch (error) {
            console.log(error)
            handleToast('error', 'Something went wrong');
            return error
          } finally {
            set({isUpdating: false})
          }
    },

    deleteAnime: async (id) => {
        set({isDeleting: true})

          try {
            const response = await http.delete(`mal/anime/${id}`);
            if(response.status === 200){
                return response
            }
            handleToast('error', 'Something went wrong');
          } catch (error) {
            console.log(error)
            handleToast('error', 'Something went wrong');
            return error
          } finally {
            set({isDeleting: false})
          }
    }

}))

export default useUserAnimeStore