import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const fetchAiringToday = async () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const result = await axios.get(
        `https://api.jikan.moe/v4/schedules?filter=${today}&limit=20&sfw=true`
    );
    const animes = result.data.data.filter(
        (obj, index, self) =>
            index === self.findIndex((t) => t.mal_id === obj.mal_id)
    );
    await localforage.setItem('airingToday', animes);
    return animes;
};

export const useAiringToday = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadCached = async () => {
            const cached = await localforage.getItem('airingToday');
            if (cached && !queryClient.getQueryData(['airingToday'])) {
                queryClient.setQueryData(['airingToday'], cached);
            }
        };
        loadCached();
    }, [queryClient]);

    return useQuery({
        queryKey: ['airingToday'],
        queryFn: fetchAiringToday,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};
