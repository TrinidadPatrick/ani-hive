import {create} from 'zustand'

const useScrollPosition = create((set) => ({
    scrollPosition: null,
    setScrollPosition: (value) => set({scrollPosition: value}),
    clickedRecommendationId: null,
    setClickedRecommendationId: (id) => set({clickedRecommendationId: id}),
    clickedRelatedId: null,
    setClickedRelatedId: (id) => set({clickedRelatedId: id})
}))

export default useScrollPosition