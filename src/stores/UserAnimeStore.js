import {create} from 'zustand'
import http from '../http.js'
import {toast} from 'react-toastify'
import localforage from "localforage";


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
    animeStatuses: [],

    isUpdating: false,
    isDeleting: false,
    isFetchingSchedule: false,

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
            const cachedList = await localforage.getItem(status);
            set({[status] : {
                animeList: cachedList,
                nextPageLink: ''
            }})
            set({isFetching: get()[status] === null})
            const response = await http.get(`mal/anime/${status}?offset=${offset}`)
            const animeList = response.data.data
            const nextPageLink = response.data.paging.next
            set({[status] : {
                animeList: animeList,
                nextPageLink: nextPageLink || ''
            }})
            await localforage.setItem(status, animeList);
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
    },

    fetchAiringData : async (lists, status) => {
        const animeIds = lists?.filter((list) => list.node?.status === 'currently_airing').map((list) => list.node.id)
        const query = `
          query ($ids: [Int]) {
            Page {
              media(idMal_in: $ids, type: ANIME) {
                idMal
                title { romaji }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
          }
        `;
      
        try {
            set({isFetchingSchedule: true})
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                body: JSON.stringify({
                  query: query,
                  variables: { ids: animeIds }
                })
              });

            const { data } = await response.json();

            set((state) => {
                const combined = [...state.animeStatuses, ...data.Page.media]
                const uniqueMap = new Map(combined.map((item) => [item.idMal, item]))
                return {animeStatuses: Array.from(uniqueMap.values())}
            })
        } catch (error) {
            console.log(error)
        } finally {
            set({isFetchingSchedule: false})
        }
    
      }

}))

export default useUserAnimeStore