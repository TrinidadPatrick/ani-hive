import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router';
import Select from 'react-select';
import Footer from '../Home/Footer';
import useExploreAnimeList from '../../stores/ExploreAnimeListStore';
import ExploreNavbar from './ExploreNavbar';
import useScrollPosition from '../../stores/ScrollPositionStore';

const Explore = () => {
  const navigate = useNavigate()
  const otherRefs = useRef([])
  const scrollPosition = useScrollPosition((s) => s.scrollPosition)
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition)
  const animeList = useExploreAnimeList((s) => s.animeList)
  const setAnimeList = useExploreAnimeList((s) => s.setAnimeList)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState([])
  const [themes, setThemes] = useState([])
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genres')?.split(',').map(Number) || []
  );
  const [selectedSortItem, setSelectedSortItem] = useState({
    order_by: searchParams.get('order_by') || '',
    sort_by: searchParams.get('sort_by') || 'desc',
  })
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedSeason, setSelectedSeason] = useState(searchParams.get('season') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [showState, setShowState] = useState('')
  const [showOtherFilter, setShowOtherFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)

  // const [animeList, setAnimeList] = useState(null)
  const [pageInfo, setPageInfo] = useState(null)
  const [pageList, setPageList] = useState([])
  const [page, setPage] = useState(searchParams.get('page') || 1)

  const status = ['Airing', 'Complete', 'Upcoming', 'Unknown']
  const otherFilters = [
    {
      name: 'Year',
      options : Array.from({length: 100}, (_, i) => i + 2000)
    },
    {
      name: 'Season',
      options: ['Spring', 'Summer', 'Fall', 'Winter', 'Unknown']
      },
    {
      name: 'Type',
      options: ['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']
    }
  ]

  const sortItems = [
    {key: 'Title', value: 'title'},
    {key: 'Start Date', value: 'start_date'},
    {key: 'End Date', value: 'end_date'},
    {key: 'Score', value: 'score'},
    {key: 'Rank', value: 'rank'},
    {key: 'Popularity', value: 'popularity'},
  ]
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGenres = async (retries = 10) => {
    try {
      const result = await axios.get(`https://api.jikan.moe/v4/genres/anime`);
      if(result.status === 200) {
        const genres = result.data.data
        const themes = [...genres]
        themes.splice(0,22)
        setThemes(themes)
        setGenres(genres)
        
      }
    } catch (error) {
      console.log(error)
      if(retries > 0)
      {
        setTimeout(()=>{
          getGenres(1, retries - 1)
        }, 1000)
      }
    }
  }

  const handleSearch = async (searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedOrderBy, selectedSortBy, pageNum , retries = 10) => {
    setSearching(animeList === null)
    const params = {};

    const seasonDates = {
      winter: { start: `${selectedYear}-01-01`, end: `${selectedYear}-03-31` },
      spring: { start: `${selectedYear}-04-01`, end: `${selectedYear}-06-30` },
      summer: { start: `${selectedYear}-07-01`, end: `${selectedYear}-09-30` },
      fall:   { start: `${selectedYear}-10-01`, end: `${selectedYear}-12-31` },
    };

    const season = seasonDates[selectedSeason.toLowerCase()];

    if (searchValue) params.q = searchValue;
    if (selectedGenres.length > 0) params.genres = selectedGenres.join(',');
    if (selectedStatus) params.status = selectedStatus;
    if (selectedSeason) params.season = selectedSeason;
    if (selectedYear) params.year = selectedYear;
    if (selectedType) params.type = selectedType;
    if (pageNum) params.page = pageNum;
    if (selectedOrderBy && selectedSortBy){
      params.order_by = selectedOrderBy;
      params.sort_by = selectedSortBy;
    }

    setSearchParams(params);
 
    const sortByParams = selectedOrderBy && selectedSortBy ? `&sort=${selectedSortBy}&order_by=${selectedOrderBy}` : ''

    const url = 
    selectedYear == '' ?
    `https://api.jikan.moe/v4/anime?q=${searchValue}&genres=${selectedGenres}&status=${selectedStatus}&type=${selectedType}&sfw=true&page=${Number(pageNum)}${sortByParams}&unapproved=false&min_score=1`
    :
    selectedSeason && selectedYear ? 
    `https://api.jikan.moe/v4/anime?q=${searchValue}&genres=${selectedGenres}&status=${selectedStatus}&start_date=${season.start}&end_date=${season.end}&type=${selectedType}&sfw=true&page=${Number(pageNum)}${sortByParams}&unapproved=false&min_score=1`
    :
    selectedYear &&
    `https://api.jikan.moe/v4/anime?q=${searchValue}&genres=${selectedGenres}&status=${selectedStatus}&start_date=${selectedYear || 1400}-01-01&end_date=${selectedYear || 3010}-12-31&type=${selectedType}&sfw=true&page=${Number(pageNum)}${sortByParams}&unapproved=false&min_score=1`
    
    try {
      const result = await axios.get(url)
      setAnimeList(result.data.data)
      setPageInfo(result.data.pagination)
      setPage(result.data.pagination.current_page)
      setSearching(false)
    } catch (error) {
      console.log(error)
      if(retries > 0)
      {
        setTimeout(()=>{
          handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedOrderBy, selectedSortBy, 1, retries - 1)
        }, 1000)
      }
    }
  }

  const handlePaginate = (pageNum) => {
    setPage(pageNum)
    setScrollPosition({...scrollPosition, explore : null})
    handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, pageNum)
  }

  useEffect(() => {
    getGenres()
  }, [])

  useEffect(() => {
    handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, page)
  }, [])

  useEffect(() => { 
    if(pageInfo){
      if(page <= 0 || page > pageInfo?.last_visible_page){
        window.location.href = `/explore?page=1`
      }

      const total_pages = pageInfo?.last_visible_page;

      // Check if current page is in the last 8 pages
      const isLastEightPages = pageInfo?.current_page > total_pages - 7;

      // Determine the starting page for the list
      const startPage = pageInfo?.current_page === 1 ? 1 : pageInfo?.current_page - 1;

      // If last 8 pages, generate from the end, otherwise generate normally
      const temp = Array.from({ length: screenWidth < 600 ? 5 : 8 }, (_, index) =>
        total_pages - 7 + index
      );

      // Final page list
      const pageLists =
        total_pages > 8
          ? isLastEightPages
            ? temp
            : Array.from({ length: screenWidth < 600 ? 4 : 8 }, (_, index) => index + startPage)
          : Array.from({ length: total_pages }, (_, index) => index + 1);

      setPageList(pageLists);
    }
  }, [pageInfo, screenWidth])

  useEffect(()=>{
    if(scrollPosition?.explore && animeList !== null) {
      window.scrollTo(0, scrollPosition.explore);
    }
  },[animeList])

  return (
    <main onClick={()=>setShowState(false)} className='w-full h-[100dvh] bg-[#141414] flex flex-col gap-5 items-center pt-20'>
      <div className='flex flex-col items-start gap-0  w-[95%] lg:w-[90%] mx-auto'>
            <h1 className='text-white text-start text-3xl font-semibold'>Explore</h1>
            <p className='text-gray-400 text-start text-sm'>Find anime that matches your preferences</p>
        </div>
      <ExploreNavbar 
        searchValue={searchValue} 
        selectedGenres={selectedGenres}
        selectedSeason={selectedSeason}
        selectedYear={selectedYear}
        selectedType={selectedType}
        selectedSortItem={selectedSortItem}
        genres={genres}
        themes={themes}
        selectedStatus={selectedStatus}
        status={status}
        showSort={showSort}
        showOtherFilter={showOtherFilter}
        showState={showState}
        otherFilters={otherFilters}
        sortItems={sortItems}
        setShowSort={setShowSort}
        setSelectedStatus={setSelectedStatus}
        setSelectedSeason={setSelectedSeason}
        setSelectedYear={setSelectedYear}
        setSelectedType={setSelectedType}
        setSelectedGenres={setSelectedGenres}
        setSearchValue={setSearchValue}
        setSelectedSortItem={setSelectedSortItem}
        setShowOtherFilter={setShowOtherFilter}
        setShowState={setShowState}
        handleSearch={handleSearch}
        otherRefs={otherRefs}
      />

      {/* List */}
      <div className="w-[90%] relative mx-auto h-fit gap-5 bg-[#141414] grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      
      {/* Results and clear filter for mobile */}
      <div className='absolute right-0 -top-1 flex w-full justify-end'>
        <p className=' text-gray-200 text-sm'>Results: {pageInfo?.items?.total}</p>
      </div>
          {
            searching ? (
            Array.from({ length: 20 }, (_, index) => index + pageInfo?.current_page).map((page, index) => {
              return (
                <div  key={index} className="w-[140px] sm:w-[160px] md:w-[180px] animate-pulse">
                  <div className="relative w-full h-[210px] sm:h-[230px] md:h-[260px] bg-gray-700 rounded-md"></div>
                  <div className="mt-2 h-4 w-3/4 bg-gray-600 rounded"></div>
                  <div className="mt-1 h-4 w-1/2 bg-gray-600 rounded"></div>
                </div>
              )
            })
            )
            :
            !searching && animeList?.length > 0 ? (
            animeList?.length > 0 &&
            animeList.map((anime, index, array) =>
            {
              if(array[index - 1]?.mal_id != anime?.mal_id){
                return (
                  <div key={index} onClick={()=> {setScrollPosition({...scrollPosition, explore: window.pageYOffset});navigate('/anime/'+anime?.mal_id)}} className="w-full h-fit rounded-lg bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="w-fit flex items-center absolute z-[999] text-white top-1 left-2 px-2 py-1 rounded-lg overflow-hidden gap-0">
                      <div className="w-full h-full bg-black opacity-55 absolute left-0 top-0"></div>
                      <svg
                        className="z-[9999]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="orange"
                          d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
                        />
                      </svg>
                      <p className="z-[9999] mt-[1px] text-sm">{anime?.score}</p>
                    </div>
                    {/* Image */}
                    <div className='rounded-lg overflow-hidden'>
                    <img
                      src={anime?.images?.webp?.image_url}
                      alt={anime?.title_english || anime?.title}
                      className=" w-full h-full hover:scale-105 object-cover rounded-lg brightness-70 aspect-[2/3]"
                    />
                    </div>

                    {/* Info */}
                    <div className="w-full px-3 py-1 bottom-0 bg-transparent sm:h-[25%] md:h-[20%] rounded-b-lg flex">
                      <div className="flex flex-col items-start w-full h-full justify-around">
                        <h2 className="text-white text-center text-sm md:text-[0.9rem] mt-1 line-clamp-2 w-full">
                          {anime?.title || ''}
                        </h2>
                        <h2 className="text-gray-300 text-center w-full text-sm md:text-sm mt-2">
                          {/* {anime?.genres.join(', ')} */}
                        </h2>
                      </div>
                    </div>
                  </div>
                )
              }})
            )
            :
            !searching && animeList?.length == 0 ? (
              <div className='w-[90vw] h-[50svh] mx-auto  rounded-lg flex flex-col justify-center items-center'>
                <h1 className='text-white text-2xl font-bold'>No results</h1>
                <p className='text-gray-400 text-sm'>Try searching with different keywords</p>
              </div>
            )
            :
            null
          }
      </div>

      {/* Pagination */}
      <div className="w-full flex gap-3 justify-center">
        {page !== 1 && (
          <button
            onClick={() =>
              {window.scrollTo({top: 0, behavior: 'smooth'}); handleSearch(
                searchValue,
                selectedGenres,
                selectedStatus,
                selectedSeason,
                selectedYear,
                selectedType,
                selectedSortItem.order_by,
                selectedSortItem.sort_by,
                page - 9 <= 0 ? 1 : page - 9
              )}
            }
            className="text-white font-medium text-[0.7rem] sm:text-xs md:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#4a4a4a39] md:hover:bg-pink-500 rounded cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.29 17.29a.996.996 0 0 0 0-1.41L14.42 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L12.3 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"/><path fill="currentColor" d="M11.7 17.29a.996.996 0 0 0 0-1.41L7.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L5.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"/></svg>
          </button>
        )}

        {pageList.length > 0 &&
          pageList.map((pageNum, index) =>
            pageNum <= pageInfo?.last_visible_page ? (
              <button
                key={index}
                onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'}); handlePaginate(pageNum)}}
                className={`text-white text-[0.7rem] sm:text-xs md:text-sm font-medium px-4 sm:px-3 py-1 sm:py-2 ${
                  pageNum === page ? 'bg-pink-500' : 'bg-[#4a4a4a39]'
                } md:hover:bg-pink-500 rounded cursor-pointer`}
              >
                {pageNum}
              </button>
            ) : null
          )}

        {!pageList.includes(Number(pageInfo?.last_visible_page)) && (
          <>
            {/* <button className="text-white font-medium px-2 sm:px-3 py-1 sm:py-2 rounded cursor-default">
              ...
            </button> */}
            <button
              onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); handlePaginate(pageInfo?.last_visible_page)}} 
              className={`text-white text-[0.7rem] sm:text-xs md:text-sm font-medium px-2 sm:px-3 py-1 sm:py-2 ${
                pageInfo?.last_visible_page === page
                  ? 'bg-pink-500'
                  : 'bg-[#4a4a4a39]'
              } md:hover:bg-pink-500 rounded cursor-pointer`}
            >
              {pageInfo?.last_visible_page}
            </button>
          </>
        )}

        {page !== pageInfo?.last_visible_page && (
          <button
            onClick={() =>
              handleSearch(
                searchValue,
                selectedGenres,
                selectedStatus,
                selectedSeason,
                selectedYear,
                selectedType,
                selectedSortItem.order_by,
                selectedSortItem.sort_by,
                page + 9
              )
            }
            className="text-white font-medium px-3 py-2 rotate-180 bg-[#4a4a4a39] md:hover:bg-pink-500 rounded cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.29 17.29a.996.996 0 0 0 0-1.41L14.42 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L12.3 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"/><path fill="currentColor" d="M11.7 17.29a.996.996 0 0 0 0-1.41L7.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L5.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"/></svg>
          </button>
        )}
      </div>


      <Footer />

    </main>
  )
}

export default Explore