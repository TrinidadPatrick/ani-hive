import {create} from 'zustand'

const useScrollPosition = create((set) => ({
    scrollPosition: null,
    setScrollPosition: (value) => set({scrollPosition: value})
}))

export default useScrollPosition