import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const fetchSeasonNowAnime = async (page = 1) => {
    const { data } = await axios.get(`https://api.jikan.moe/v4/seasons/now?page=${page}`);
    const animes = data.data;
    await localforage.setItem('seasonNowAnime', animes);
    return animes;
};

export const useSeasonNowAnime = (page = 1) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadCached = async () => {
            const cached = await localforage.getItem('seasonNowAnime');
            if (cached && !queryClient.getQueryData(['seasonNowAnime', page])) {
                queryClient.setQueryData(['seasonNowAnime', page], cached);
            }
        };
        loadCached();
    }, [queryClient, page]);

    return useQuery({
        queryKey: ['seasonNowAnime', page],
        queryFn: () => fetchSeasonNowAnime(page),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
