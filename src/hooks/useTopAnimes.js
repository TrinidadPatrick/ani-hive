import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const fetchTopAnimes = async (page = 1) => {
    const { data } = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    await localforage.setItem('topAnime', data);
    return data;
};

export const useTopAnimes = (page = 1) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadCached = async () => {
            const cached = await localforage.getItem('topAnime');
            if (cached && !queryClient.getQueryData(['topAnimes', page])) {
                queryClient.setQueryData(['topAnimes', page], cached);
            }
        };
        loadCached();
    }, [queryClient, page]);

    return useQuery({
        queryKey: ['topAnimes', page],
        queryFn: () => fetchTopAnimes(page),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
