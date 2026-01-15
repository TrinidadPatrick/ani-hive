import {create} from 'zustand'

const useExploreAnimeList = create((set) => ({
    animeList: null,
    setAnimeList: (value) => set({animeList: value})
}))

export default useExploreAnimeList