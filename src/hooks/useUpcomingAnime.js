import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const fetchUpcomingAnime = async (page = 1) => {
    const result = await axios.get(
        `https://api.jikan.moe/v4/seasons/upcoming?page=${page}`
    );
    const animes = result.data;
    await localforage.setItem("upcomingAnimes", animes);
    return animes;
};

export const useUpcomingAnime = (page = 1) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadCached = async () => {
            const cached = await localforage.getItem("upcomingAnimes");
            if (cached && !queryClient.getQueryData(['upcomingAnime', page])) {
                queryClient.setQueryData(['upcomingAnime', page], cached);
            }
        };
        loadCached();
    }, [queryClient, page]);

    return useQuery({
        queryKey: ['upcomingAnime', page],
        queryFn: () => fetchUpcomingAnime(page),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};
