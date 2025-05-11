import {create} from 'zustand'

const OngoingAnimeStore = create((set) => ({
    OngoingAnime: null,
    s_setOngoingAnime: (OngoingAnime) => set({OngoingAnime})
}))

export default OngoingAnimeStore