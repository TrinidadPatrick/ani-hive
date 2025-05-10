import {create} from 'zustand'

const AnimeMoviesStore = create((set) => ({
    AnimeMovies: null,
    s_setAnimeMovies: (AnimeMovies) => set({AnimeMovies})
}))

export default AnimeMoviesStore