import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import Select from 'react-select';
import Footer from '../Home/Footer';

const Explore = () => {
  const navigate = useNavigate()
  const otherRefs = useRef([])
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

  const [animeList, setAnimeList] = useState(null)
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

    // Cleanup event listener on unmount
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

  const handleSelectedOrderBy = (orderBy) => {
    setSelectedSortItem({...selectedSortItem, order_by: orderBy})
  }

  const handleSelectedSortBy = (sortBy) => {
    setSelectedSortItem({...selectedSortItem, sort_by: sortBy})
  }

  const handleSelectGenre = (genre) => {
    const newSelectedGenres = [...selectedGenres]
    if(newSelectedGenres.includes(genre?.mal_id)){
      newSelectedGenres.splice(newSelectedGenres.indexOf(genre?.mal_id), 1)
    }else{
      newSelectedGenres.push(genre?.mal_id)
    }
    setSelectedGenres(newSelectedGenres)
  }

  const handleSelectStatus = (status) => {
    if(status == selectedStatus){
      setSelectedStatus('')
    }else{
      setSelectedStatus(status)
    }
  }

  const handleSelectSeason = (season) => {
    if(season == selectedSeason){
      setSelectedSeason('')
      }else{
        setSelectedSeason(season)
      }
  }

  const handleSelectYear = (year) => {
    if(year == selectedYear){
      setSelectedYear('')
    }else{
      setSelectedYear(year)
      }
  }

  const handleSelectType = (type) => {
    if(type == selectedType){
      setSelectedType('')
      }else{
        setSelectedType(type)
      }
  }

  const handleSearch = async (searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedOrderBy, selectedSortBy, pageNum , retries = 10) => {
    setSearching(true)
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
    selectedYear
    `https://api.jikan.moe/v4/anime?q=${searchValue}&genres=${selectedGenres}&status=${selectedStatus}&start_date=${selectedYear || 1400}-01-01&end_date=${selectedYear || 3010}-12-31&type=${selectedType}&sfw=true&page=${Number(pageNum)}${sortByParams}&unapproved=false&min_score=1`
    
    try {
      const result = await axios.get(url)
      setAnimeList(result.data.data)
      setPageInfo(result.data.pagination)
      setPage(result.data.pagination.current_page)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, pageNum)
  }

  const isClearFilterDisabled = () => {
    return selectedGenres.length == 0 && selectedStatus == '' && selectedSeason == '' && selectedYear == '' && selectedType == '' && selectedSortItem.order_by == ''
  }

  const handleClear = () => {
    handleSearch(searchValue, [], '', '', '', '','','', 1)
    setShowState('')
    setSelectedSortItem({
      order_by: '',
      sort_by: 'desc'
    })
    setSelectedGenres([])
    setSelectedStatus('')
    setSelectedSeason('')
    setSelectedYear('') 
    setSelectedType('')
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

      // Final paginated page list
      const pageLists =
        total_pages > 8
          ? isLastEightPages
            ? temp
            : Array.from({ length: screenWidth < 600 ? 4 : 8 }, (_, index) => index + startPage)
          : Array.from({ length: total_pages }, (_, index) => index + 1);

      setPageList(pageLists);
    }
  }, [pageInfo, screenWidth])
  return (
    <main onClick={()=>setShowState(false)} className='w-full h-[100dvh] bg-[#141414] flex flex-col gap-5 items-center pt-20'>
      <div className='flex flex-col items-start gap-0  w-[95%] lg:w-[90%] mx-auto'>
            <h1 className='text-white text-start text-3xl font-semibold'>Explore</h1>
            <p className='text-gray-400 text-start text-sm'>Find anime that matches your preferences</p>
        </div>

      {/* Navbar */}
      <div onClick={(e)=> e.stopPropagation()} className=" w-[95%]  lg:w-[90%] z-[999999] flex gap-y-7 gap-x-2 py-2 ">
        {/* Search Bar */}
        <div className='flex w-full gap-3 items-center relative'>
          <input onKeyDown={(e)=>{if(e.key === 'Enter') handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, 1)}} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} type="text" className=" outline-0 w-full ps-2 h-10 bg-gray-800 rounded-lg text-white" placeholder="Search..." />
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="lightGray" strokeLinejoin="round" strokeWidth="4"><path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"/><path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"/></g></svg>
          </button>
        </div>
        {/* Genre */}
        <div className='hidden sm:flex w-full items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowState(showState === 'genre' ? '' : 'genre')}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
          <p className='ps-2 text-gray-400'>{selectedGenres.length == 0 ? 'Genre' : selectedGenres.map((genre) => genres?.find((g) => g.mal_id == genre)?.name).join(', ')}</p>
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
          </button>
          </div>
          
            <div className={`${showState === 'genre' ? '' : 'hidden'} w-fit h-fit absolute top-12 z-[99999999999999] `}>
            {/* <OutsideClickHandler onOutsideClick={showState === 'genre' ? ()=>{setShowState('genre')} : ()=>{}}> */}
            <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[400px] gap-3  bg-gray-800 grid grid-cols-2 md:grid-cols-4 left-0 top-12 p-2 rounded-lg'>
              {
                genres.slice(0,18).map((genre, index) => {
                  const isSelected = selectedGenres.includes(genre?.mal_id)
                  return (
                    <button onClick={()=>{handleSelectGenre(genre)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                      <input type="checkbox" onChange={()=>{}} className='border-0 cursor-pointer' checked={isSelected} name="genre" id="" />
                      {genre?.name}
                    </button>
                  );
                })
              }
            </div>
            {/* </OutsideClickHandler> */}
            </div>
        </div>
        {/* Theme */}
        <div className='hidden md:flex w-full items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowState(showState === 'theme' ? '' : 'theme')}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
          <p className='ps-2 text-gray-400'>Theme</p>
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
          </button>
          </div>
          <div className={`${showState === 'theme' ? '' : 'hidden'} w-full h-full absolute top-12 `}>
          {/* <OutsideClickHandler onOutsideClick={showState === 'theme' ? ()=>{setShowState('')} : ()=>{}}> */}
          <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[400px] gap-3 bg-gray-800 grid grid-cols-2 md:grid-cols-3 right-0 lg:left-0 top-12 p-2 rounded-lg'>
          {
            themes.map((genre, index) => {
              const isSelected = selectedGenres.includes(genre?.mal_id)
              return (
                <button onClick={()=>{handleSelectGenre(genre)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                  <input onChange={()=>{}} value={genre.mal_id} type="checkbox" className='border-0 cursor-pointer' checked={isSelected} name="genre" id="" />
                  {genre?.name}
                </button>
              );
            })
          }
          </div>
          {/* </OutsideClickHandler> */}
          </div>
        </div>
        {/* Status */}
        <div className='w-full hidden lg:flex items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowState(showState === 'status' ? '' : 'status')}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
          <p className='ps-2 text-gray-400'>{selectedStatus == '' ? 'Status' : selectedStatus}</p>
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
          </button>
          </div>
          <div className={`${showState === 'status' ? '' : 'hidden'} w-full h-full absolute top-12`}>
          {/* <OutsideClickHandler onOutsideClick={showState === 'status' ? ()=>{setShowState('')} : ()=>{}}> */}
          <div className='w-full left-0 gap-3 absolute bg-gray-800 grid grid-cols-1 p-2 rounded-lg'>
            {
              status.map((stat, index) => {
                const isSelected = selectedStatus.toLowerCase() == stat.toLowerCase()
                return (
                  <button onClick={()=>{handleSelectStatus(stat)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                    <input type="checkbox" onChange={()=>{}} value={stat} className='border-0 cursor-pointer' checked={isSelected} name="status" id="" />
                    {stat}
                  </button>
                );
              })
            }
          </div>
          {/* </OutsideClickHandler> */}
          </div>
        </div>

        {/* Sort */}
        <div className='flex w-fit px-1 items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowSort(!showSort)}} className='cursor-pointer z-[99999999999] relative p-1 flex  items-center w-full h-full '>
          <button className="text-white right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/></svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14H2m6-4H2m4-4H2m10 12H2m17 2V4m0 16l3-3m-3 3l-3-3m3-13l3 3m-3-3l-3 3"/></svg>
          </button>
          </div>
          {
            showSort &&
          <div className=' w-full h-full absolute'>
            <OutsideClickHandler onOutsideClick={()=>{setShowSort(false);}}>
              <div className='flex flex-col w-[300px] xs:w-[350px] -right-20 xs:right-0 gap-3 absolute bg-gray-700 top-12 rounded-lg'>
                <div className='w-full bg-gray-900 p-2 flex gap-3 items-center justify-between'>
                  <span className='text-gray-400 text-sm uppercase'>Sort options</span>
                    <div className='flex items-center gap-2'>
                    <button onClick={()=>handleSelectedSortBy('asc')} className={`${selectedSortItem.sort_by === 'asc' ? 'bg-gray-600' : 'bg-gray-800' } cursor-pointer  px-2 py-1 text-gray-400 rounded text-sm`}>Asc </button>
                    <button onClick={()=>handleSelectedSortBy('desc')} className={`${selectedSortItem.sort_by === 'desc' ? 'bg-gray-600' : 'bg-gray-800' } cursor-pointer  px-2 py-1 text-gray-400 rounded text-sm`}> Desc</button>
                    </div>
                </div>
                <div className='grid grid-cols-3 w-full p-2 gap-3'>
                {
                  sortItems.map((item, index) => {
                    // const isSelected = selectedStatus.includes(stat)
                    return (
                      <div onClick={()=>handleSelectedOrderBy(item.value)} key={index} className={`flex gap-1 z-[999999999] w-full items-center relative ${selectedSortItem.order_by === item.value ? 'bg-gray-900' : 'bg-gray-800'}  hover:bg-gray-900 py-1 px-2 rounded-lg cursor-pointer`}>
                        <input type='checkbox' checked={selectedSortItem.order_by === item.value} />
                        <p className='text-gray-400 text-sm md:text-base text-start w-full'>{item.key}</p>
                      </div>
                    );
                  })
                }
                </div>
              </div>
            </OutsideClickHandler>
          </div>
          }
        </div>

        {/* Other Filter */}
        <div className='flex w-fit px-1 items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowOtherFilter(!showOtherFilter)}} className='cursor-pointer z-[99999999999] relative p-1 flex  items-center w-full h-full '>
          <button className="text-white right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/></svg>
          </button>
          </div>
          {
            showOtherFilter &&
            <div className=' w-full h-full absolute'>
          <OutsideClickHandler onOutsideClick={()=>{setShowOtherFilter(false);['status_v2','genre_v2','theme_v2', 'Season', 'Year', 'Type'].includes(showState) ? setShowState('') : ''}}>
          <div className='w-[300px] xs:w-[350px] -right-20 xs:right-0 gap-3 absolute bg-gray-700 grid grid-cols-3 top-12 p-2 rounded-lg'>
            {
              otherFilters.map((filter, index) => {
                // const isSelected = selectedStatus.includes(stat)
                return (
                  <div key={index} onClick={()=>{setShowState(filter.name == showState ? '' : filter.name)}} className='flex z-[999999999] w-full items-center relative bg-gray-800 hover:bg-gray-900 py-1 px-2 rounded-lg cursor-pointer'>
                    <p className='text-gray-400 text-sm md:text-base text-start w-full'>{filter.name}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
                    {
                      showState === filter.name &&
                      <div id={filter.name} ref={(rel) => {otherRefs.current[index] = rel}} className=' w-full h-full absolute z-[99999999999999999999999999999] '>
                      {/* <OtherFilterDropDown_V2 name={filter.name} options={filter.options} /> */}
                      <div  className='otherFilter z-[9999999999999999999999999999999] w-full max-h-[300px] overflow-auto gap-3 -left-2 absolute bg-gray-800 grid grid-cols-1 top-8 md:top-9 p-2 rounded-lg'>
                        {
                        filter.options?.map((option, index) => {
                          const isSelected = filter.name === 'Season' ? selectedSeason == option : filter.name === 'Year' ? selectedYear == option : selectedType == option
                          // filter.name == 'Season' && console.log( selectedSeason.includes(option), option)
                          return (
                            <button disabled={filter.name === 'Season' && selectedYear == ''} onClick={(e)=>{filter.name === 'Season' ? handleSelectSeason(option) : filter.name === 'Year' ? handleSelectYear(option) : handleSelectType(option); e.stopPropagation()}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                              <input disabled={filter.name === 'Season' && selectedYear == ''} type="checkbox" onChange={()=>{}} checked={isSelected} value={option} className='border-0 cursor-pointer'  name="status" id="" />
                              {option}
                            </button>
                          );
                        })
                        }
                        {filter.name == 'Season' && selectedYear == '' && <p className='text-red-500 text-[0.65rem] sm:text-xs'>Select a year first</p>}
                      </div>
                    </div>
                    }
                  </div>
                );
              })
            }
            {/* Genre */}
          <div className='flex sm:hidden w-full items-center relative  rounded-lg '>
            <button onClick={()=>{showState === 'genre_v2' ? setShowState( '') : setShowState('genre_v2')}} className='cursor-pointer z-[99999] rounded-lg relative p-1 flex bg-gray-800 hover:bg-gray-900 items-center w-full h-full '>
              <p className='ps-1 text-gray-400 text-sm md:text-base '>Genre</p>
              <div className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </div>
            </button>
            {
              showState === 'genre_v2' &&
              <div className={` w-[290px] bg-transparent  h-full absolute`}>
              {/* <OutsideClickHandler onOutsideClick={showState === 'genre_v2' ? ()=>{setShowState('')} : ()=>{}}> */}
                <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[400px] gap-3 absolute bg-gray-800 grid grid-cols-2 md:grid-cols-4 left-0 top-8 p-2 rounded-lg'>
                  {
                    genres.slice(0,18).map((genre, index) => {
                      const isSelected = selectedGenres.includes(genre?.mal_id)
                      return (
                        <button onClick={()=>{handleSelectGenre(genre)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                          <input type="checkbox" onChange={()=>{}} className='border-0 cursor-pointer' checked={isSelected} name="genre" id="" />
                          {genre?.name}
                        </button>
                      );
                    })
                  }
                </div>
              {/* </OutsideClickHandler> */}
            </div>
            }
          </div>
          {/* Theme */}
          <div className='flex md:hidden w-full items-center relative bg-gray-800 hover:bg-gray-900 rounded-lg cursor-pointer'>
            <button onClick={()=>{setShowState(showState === 'theme_v2' ? '' : 'theme_v2')}} className='cursor-pointer relative p-1 flex z-[9999] items-center w-full h-full '>
              <p className='ps-1 text-gray-400 text-sm md:text-base '>Theme</p>
              <div className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </div>
            </button>
            {
              showState === 'theme_v2' &&
              <div className={`w-[290px] h-full absolute`}>
                <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[300px] gap-3 absolute bg-gray-800 grid grid-cols-2 md:grid-cols-3 -left-24 lg:left-0 top-8 p-2 rounded-lg'>
                {
                  themes.map((genre, index) => {
                    const isSelected = selectedGenres.includes(genre?.mal_id)
                    return (
                      <button onClick={()=>{handleSelectGenre(genre)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                        <input onChange={()=>{}} value={genre.mal_id} type="checkbox" className='border-0 cursor-pointer' checked={isSelected} name="genre" id="" />
                        {genre?.name}
                      </button>
                    );
                  })
                }
                </div>
            </div>
            }
          </div>
          {/* Status */}
          <div className='w-full flex lg:hidden items-center relative bg-gray-800 hover:bg-gray-900 rounded-lg cursor-pointer'>
            <button onClick={()=>{setShowState(showState === 'status_v2' ? '' : 'status_v2')}} className='cursor-pointer relative p-1 flex z-[99999] items-center w-full h-full '>
              <p className='ps-1 text-gray-400 text-sm md:text-base '>{selectedStatus == '' ? 'Status' : selectedStatus}</p>
              <div className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </div>
            </button>
            {
              showState === 'status_v2' &&
              <div className={` w-[100px] h-full absolute`}>
                <div className='w-full left-0 gap-3 absolute bg-gray-800 grid grid-cols-1 top-8 md:top-9 p-2 rounded-lg'>
                  {
                    status.map((stat, index) => {
                      const isSelected = selectedStatus.toLowerCase() == stat.toLowerCase()
                      return (
                        <button onClick={()=>{handleSelectStatus(stat)}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                          <input type="checkbox" onChange={()=>{}} value={stat} className='border-0 cursor-pointer' checked={isSelected} name="status" id="" />
                          {stat}
                        </button>
                      );
                    })
                  }
                </div>
            </div>
            }
          </div>
          </div>
          </OutsideClickHandler>
          </div>
          }
        </div>

        {/* Search button */}
        <button onClick={()=>{handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, 1);setShowState('')}} 
        className='flex w-fit px-4 md:px-10 lg:w-fit text-center justify-center text-white items-center relative bg-pink-500 hover:bg-pink-400 rounded-lg cursor-pointer'>
          Search
        </button>
        {/* Clear Filter button */}
        <button disabled={isClearFilterDisabled()} onClick={()=>{handleClear()}} 
        className='flex w-fit px-3 md:px-5 lg:w-fit disabled:bg-gray-400 disabled:cursor-default whitespace-nowrap text-center justify-center text-gray-500 items-center relative bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer'>
          {
            screenWidth > 600 ? 'Clear filter' :
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048"><path fill="currentColor" d="M0 128h2048v219l-768 768v805H768v-805L0 347zm1920 165v-37H128v37l768 768v731h256v-731zm37 987l91 91l-230 229l230 229l-91 91l-229-230l-229 230l-91-91l230-229l-230-229l91-91l229 230z"/></svg>
          }
          {/* Clear filter */}
        </button>
      </div>
      {/* List */}
      <div className="w-[90%] relative mx-auto h-fit gap-5 bg-[#141414] grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {/* Results */}
      <p className='absolute right-0 text-gray-200 text-sm -top-1'>Results: {pageInfo?.items?.total}</p>
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
                  <div key={index} onClick={()=> {navigate('/anime/'+anime?.mal_id)}} className="w-full h-fit rounded-lg bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center">
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