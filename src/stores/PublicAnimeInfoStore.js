import {create} from 'zustand'

const usePublicAnimeInfo = create((set) => ({
    recommendations: null,
    animeRelations: null,

    setAnimeRelations: (value) => set({animeRelations : value}),
    setRecommendations: (value) => set({recommendations: value})
}))

export default usePublicAnimeInfo