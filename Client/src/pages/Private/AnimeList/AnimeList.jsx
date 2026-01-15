import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useUserAnimeStore from '../../../stores/UserAnimeStore'
import AnimeCard from '../../../components/MalComponents/MalAnimeList/AnimeCard.jsx';
import StatusBar from '../../../components/MalComponents/MalAnimeList/StatusBar.jsx';
import AnimeListSearch from '../../../components/MalComponents/MalAnimeList/AnimeListSearch.jsx';
import useScrollPosition from '../../../stores/ScrollPositionStore.js';
import UserStatistics from '../../../components/MalComponents/MalAnimeList/UserStatistics.jsx';
import { motion } from "framer-motion";
import AnimeCardV2 from '../../../components/MalComponents/MalAnimeList/AnimeCardV2.jsx';
import AnimeListSkeleton from '../../../components/MalComponents/Skeletons/AnimeListSkeleton.jsx';

const AnimeList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const validStatuses = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];
  const {status} = useParams()
  const scrollPosition = useScrollPosition((s) => s.scrollPosition)
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition)
  const getList = useUserAnimeStore((s) => s.getList)
  const list = useUserAnimeStore((s) => s[status])
  const fetchAiringData = useUserAnimeStore((s) => s.fetchAiringData)

  const animeId = searchParams.get('id')

  const [displayLimit, setDisplayLimit] = useState(20);
  const observerTarget = useRef(null);
  const scrollRefMap = useRef(new Map());

  const [listType, setListType] = useState(localStorage.getItem('listType') || 'grid')
  const [searchValue, setSearchValue] = useState('')
  const [genreValue, setGenreValue] = useState([])
  const [dateValue, setDateValue] = useState({
          startDate: {
            year: null, month: null, day: null
          },
          endDate: {
            year: null, month: null, day: null
          }
  });

  if (!validStatuses.includes(status)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    getList(status)
  }, [status])

  useEffect(() => {
    if(list && scrollPosition?.userList){
      window.scrollTo({
        top: scrollPosition.userList
      })
    }
  },[list])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
       if(!scrollPosition?.userList){
         if (entries[0].isIntersecting) {
          setDisplayLimit((prev) => prev + (10));
        }
       }else{
        setDisplayLimit(100000)
       }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [list]);

  useEffect(() => {
    if(list){
      fetchAiringData(list.animeList, status)
    }
  },[list])

  useEffect(() => {
    if(animeId){
      setDisplayLimit(10000)
      if(animeId && list){
        setTimeout(() => {
          const element = scrollRefMap.current.get(animeId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500)
      }
    }else {
      setDisplayLimit(20)
    }
  },[location, list])

  const handleSelect = (url) => {
    setScrollPosition({...scrollPosition, userList: window.pageYOffset})
    navigate(url)
  }

  const mapAnime = useMemo(()=> {
    if(list !== null){
    const shouldFilterDate = dateValue.startDate.year !== null
    const startDate = new Date(dateValue.startDate.year, dateValue.startDate.month, dateValue.startDate.day)
    const endDate = (!dateValue.endDate.year && !dateValue.endDate.month && !dateValue.endDate.day) ? new Date() : new Date(dateValue.endDate.year, dateValue.endDate.month, dateValue.endDate.day)

    let finalList = []
    finalList =  list?.animeList?.filter((anime) => anime.node.title.toLowerCase().includes(searchValue.toLowerCase()))
    finalList = genreValue.length !== 0 ? finalList.filter((a) => a.node.genres.some((b) => genreValue.includes(b.name))) : finalList
    finalList = shouldFilterDate ? finalList.filter((list) => new Date(list.node.start_date) >= startDate && new Date(list.node.end_date) <= endDate) : finalList
    return finalList
    }
  },[searchValue, status, list, genreValue, dateValue])

  return (
    <div className='w-full h-full pt-20 flex flex-col max-w-7xl xl:max-w-[90vw] mx-auto'> 
      {/* Title */}
      <header className=' p-2 sm:p-4'>
        <h1 className='text-white text-4xl font-bold'>My Anime list</h1>
        <h5 className='text-gray-300 text-lg font-semibold'>Track your anime in with fashion</h5>
      </header>

      {/* User statistics */}
      <section>
        <UserStatistics />
      </section>

      {/* Status bar and search input */}
      <section className='w-full flex flex-col lg:flex-row justify-between items-center'>
        <StatusBar status={status} setScrollPosition={setScrollPosition} scrollPosition={scrollPosition} />
        <AnimeListSearch listType={listType} setListType={setListType} setGenreValue={setGenreValue} setSearchValue={setSearchValue} setDateValue={setDateValue} />
      </section>
      {
        list === null ? ( <> <AnimeListSkeleton /> </> ) :
        (
        <>
          <section className={`grid ${listType === 'grid' ? ' grid-cols-1 semiMd:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6 ' : 
              'grid-cols-1 xxs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 semiMd:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-4'} p-2 sm:p-4`}>
            {
              list && mapAnime?.slice(0,displayLimit)?.map((item, index) => {
                const anime = item.node
                const animeInfo = item.list_status
                return (
                  <motion.div
                  ref={(node) => {
                    if (node) scrollRefMap.current.set(anime.id.toString(), node);
                  }}
                  key={anime.id}
                  layout="position"
                  className=""
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  >
                  <div className={`overflow-visible h-full ${animeId == anime.id && 'border rounded-lg border-pink-600'}`} key={anime.id}>
                    {
                      listType === 'grid' ? <AnimeCard anime={anime} animeInfo={animeInfo} status={status} handleSelect={handleSelect} /> : <AnimeCardV2 anime={anime} animeInfo={animeInfo} status={status} />
                    }
                  </div>
                  </motion.div>
                )
              })
            }
            <div ref={observerTarget} style={{ height: '20px' }}></div>
          </section>
        </>
        )
      }
    </div>
  )
}

export default AnimeList