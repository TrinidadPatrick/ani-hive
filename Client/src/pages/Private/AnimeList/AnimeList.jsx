import React, { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useUserAnimeStore from '../../../stores/UserAnimeStore'
import AnimeCard from '../../../components/MalComponents/MalAnimeList/AnimeCard.jsx';

const AnimeList = () => {
  const validStatuses = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];
  const {status} = useParams()
  const getList = useUserAnimeStore((s) => s.getList)
  const list = useUserAnimeStore((s) => s[status])
  const isFetching = useUserAnimeStore((s) => s.isFetching)

  if (!validStatuses.includes(status)) {
    return <Navigate to="/" replace />;
  }

  // console.log(list)

  useEffect(() => {
    getList(status)
  }, [status])

  if(isFetching){
    return (
      <div className='text-white w-full h-full flex justify-center items-center'>Loading</div>
    )
  }

  return (
    <div className='w-full h-full pt-20 '>
      <section className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 max-w-6xl mx-auto'>
      {
        list && list?.animeList?.map((item, index) => {
          const anime = item.node
          const animeInfo = item.list_status
          return (
            <div className=''>
              <AnimeCard anime={anime} animeInfo={animeInfo} />
            </div>
          )
        })
      }
      </section>
    </div>
  )
}

export default AnimeList