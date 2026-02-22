import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const fetchAnimeMovies = async (page = 1) => {
    const result = await axios.get(
        `https://api.jikan.moe/v4/anime?type=movie&order_by=popularity&sort=asc&page=${page}`
    );
    const animes = result.data.data;
    await localforage.setItem('animeMovies', animes);
    return animes;
};

export const useAnimeMovies = (page = 1) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadCached = async () => {
            const cached = await localforage.getItem('animeMovies');
            if (cached && !queryClient.getQueryData(['animeMovies', page])) {
                queryClient.setQueryData(['animeMovies', page], cached);
            }
        };
        loadCached();
    }, [queryClient, page]);

    return useQuery({
        queryKey: ['animeMovies', page],
        queryFn: () => fetchAnimeMovies(page),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};
