import { create } from 'zustand'

const usePublicAnimeInfo = create((set) => ({
    recommendations: null,
    animeRelations: null,

    setAnimeRelations: (relatedAnimes) =>
        set((state) => {
            const existingIds = state.animeRelations === null ? new Set([]) : new Set(state.animeRelations.map((a) => a.idMal))
            const newRelatedAnimes = relatedAnimes.filter((a) => !existingIds.has(a.idMal))
            const newAnimeRelations = [...state.animeRelations || [], ...newRelatedAnimes]
            return {
                animeRelations: newAnimeRelations
            }
        }),
    setRecommendations: (recommendedAnimes) =>
        set((state) => {
            const existingIds = state.recommendations === null ? new Set([]) : new Set(state.recommendations.map((a) => a.mediaRecommendation.idMal))
            const newReco = recommendedAnimes.filter((a) => !existingIds.has(a.mediaRecommendation.idMal))
            const newRecommendations = [...state.recommendations || [], ...newReco]
            return {
                recommendations: newRecommendations
            }
        }),
}))

export default usePublicAnimeInfo