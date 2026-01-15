import {create} from 'zustand'

const topAnimeStore = create((set) => ({
    topAnimes: null,
    s_setTopAnimes: (topAnimes) => set({topAnimes})
}))

export default topAnimeStore