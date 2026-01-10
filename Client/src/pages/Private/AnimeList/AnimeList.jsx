import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useUserAnimeStore from '../../../stores/UserAnimeStore'
import AnimeCard from '../../../components/MalComponents/MalAnimeList/AnimeCard.jsx';
import StatusBar from '../../../components/MalComponents/MalAnimeList/StatusBar.jsx';
import AnimeListSearch from '../../../components/MalComponents/MalAnimeList/AnimeListSearch.jsx';

const AnimeList = () => {
  const validStatuses = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];
  const {status} = useParams()
  const getList = useUserAnimeStore((s) => s.getList)
  const list = useUserAnimeStore((s) => s[status])
  const isFetching = useUserAnimeStore((s) => s.isFetching)

  const [searchValue, setSearchValue] = useState('')

  if (!validStatuses.includes(status)) {
    return <Navigate to="/" replace />;
  }

  // console.log(list)
  useEffect(() => {
    getList(status)
  }, [status])

  const mapAnime = useMemo(()=> {
    if(searchValue === '') return list.animeList

    return list?.animeList?.filter((anime) => anime.node.title.toLowerCase().includes(searchValue.toLowerCase()))
  },[searchValue, status])

  return (
    <div className='w-full h-full pt-20 flex flex-col max-w-7xl xl:max-w-[90vw] mx-auto'> 
      {/* Title */}
      <header className='p-4'>
        <h1 className='text-white text-4xl font-bold'>My Anime list</h1>
        <h5 className='text-gray-300 text-lg font-semibold'>Track your anime in with fashion</h5>
      </header>

      {/* Status bar and search input */}
      <section className='w-full flex justify-between items-center'>
        <StatusBar status={status} />
        <AnimeListSearch searchValue={searchValue} setSearchValue={setSearchValue} />
      </section>
      
      <section className='grid grid-cols-1 semiMd:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 p-4'>
      {isFetching && <div className='text-white w-full h-full flex justify-center items-center'>Loading</div>}
      {
        list && mapAnime?.map((item) => {
          const anime = item.node
          const animeInfo = item.list_status
          return (
            <div className='' key={anime.id}>
              <AnimeCard anime={anime} animeInfo={animeInfo} status={status} />
            </div>
          )
        })
      }
      </section>
    </div>
  )
}

export default AnimeList