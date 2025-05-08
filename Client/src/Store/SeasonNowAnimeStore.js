import {create} from 'zustand'

const SeasonNowAnimeStore = create((set) => ({
    SeasonNowAnime: null,
    s_setSeasonNowAnime: (SeasonNowAnime) => set({SeasonNowAnime})
}))

export default SeasonNowAnimeStore