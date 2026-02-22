import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { useEffect } from 'react';

const ongoingAnimeQuery = `
  query($page: Int) {
    Page(page: $page, perPage: 40) {
      pageInfo {
        hasNextPage
        currentPage
      }
      media(status: RELEASING, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        id
        idMal
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        duration
        genres
        episodes
        nextAiringEpisode {
          episode
          airingAt
        }
        siteUrl
        trending
        popularity
      }
    }
  }
`;

const fetchOngoingAnime = async (page = 1) => {
  const response = await axios.post(
    'https://graphql.anilist.co',
    { query: ongoingAnimeQuery, variables: { page } },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const animes = response.data.data.Page.media;

  const cached = await localforage.getItem('ongoingAnime') || [];
  const animeMap = new Map(cached.map(item => [item.id, item]));
  animes.forEach(item => animeMap.set(item.id, item));
  const updated = Array.from(animeMap.values());
  await localforage.setItem('ongoingAnime', updated);

  return animes;
};

export const useOngoingAnime = (page = 1) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadCached = async () => {
      const cached = await localforage.getItem('ongoingAnime');
      if (cached && !queryClient.getQueryData(['ongoingAnime', page])) {
        if (page === 1) {
          queryClient.setQueryData(['ongoingAnime', page], cached);
        }
      }
    };
    loadCached();
  }, [queryClient, page]);

  return useQuery({
    queryKey: ['ongoingAnime', page],
    queryFn: () => fetchOngoingAnime(page),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
