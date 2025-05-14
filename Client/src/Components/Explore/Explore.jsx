import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import Select from 'react-select';

const Explore = () => {
  const navigate = useNavigate()
  const otherRefs = useRef([])
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState([])
  const [themes, setThemes] = useState([])
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genres')?.split(',').map(Number) || []
  );
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedSeason, setSelectedSeason] = useState(searchParams.get('season') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [showState, setShowState] = useState('')
  const [showOtherFilter, setShowOtherFilter] = useState(false)

  const [animeList, setAnimeList] = useState([])
  const [pageInfo, setPageInfo] = useState(null)

  const status = ['Airing', 'Complete', 'Upcoming', 'Unknown']
  const otherFilters = [
    {
    name: 'Season',
    options: ['Spring', 'Summer', 'Fall', 'Winter', 'Unknown']
    },
    {
      name: 'Year',
      options : Array.from({length: 100}, (_, i) => i + 2000)
    },
    {
      name: 'Type',
      options: ['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']
    }
  ]
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // cleanup
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

  const handleSearch = async (searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, retires = 10) => {
    const params = {};

  if (searchValue) params.q = searchValue;
  if (selectedGenres.length > 0) params.genres = selectedGenres.join(',');
  if (selectedStatus) params.status = selectedStatus;
  if (selectedSeason) params.season = selectedSeason;
  if (selectedYear) params.year = selectedYear;
  if (selectedType) params.type = selectedType;

  setSearchParams(params);

    const url = `https://api.jikan.moe/v4/anime?q=${searchValue}&genres=${selectedGenres}&status=${selectedStatus}&season=${selectedSeason}&year=${selectedYear}&type=${selectedType}&order_by=members&sort=desc`
    // console.log(genreQuery)
    try {
      const result = await axios.get(url)
      setAnimeList(result.data.data)
      setPageInfo(result.data.pagination)
    } catch (error) {
      console.log(error)
      if(retires > 0)
      {
        setTimeout(()=>{
          handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, retires - 1)
        }, 1000)
      }
    }
  }

  useEffect(() => {
    getGenres()
  }, [])

  useEffect(() => {
    handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType)
  }, [])

  const pageLists = Array.from({ length: 8 }, (_, index) => index + pageInfo?.current_page)
  console.log(pageLists)

  return (
    <main onClick={()=>setShowState(false)} className='w-full h-[100svh] bg-[#141414] flex flex-col gap-5 items-center pb-10 pt-20'>
      <h1 className='text-white text-4xl font-medium'>Explore</h1>

      {/* Navbar */}
      <div onClick={(e)=> e.stopPropagation()} className=" w-[95%]  lg:w-[80%] z-[999999] flex gap-y-7 gap-x-2 p-4 ">
        {/* Search Bar */}
        <div className='flex w-full gap-3 items-center relative'>
          <input onKeyDown={(e)=>{if(e.key === 'Enter') handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType)}} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} type="text" className=" outline-0 w-full ps-2 h-10 bg-gray-800 rounded-lg text-white" placeholder="Search..." />
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="lightGray" strokeLinejoin="round" strokeWidth="4"><path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"/><path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"/></g></svg>
          </button>
        </div>
        {/* Genre */}
        <div className='hidden sm:flex w-full items-center relative bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer'>
          <div onClick={()=>{setShowState(showState === 'genre' ? '' : 'genre')}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
          <p className='ps-2 text-gray-400'>Genre</p>
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
          <p className='ps-2 text-gray-400'>Status</p>
          <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
          </button>
          </div>
          <div className={`${showState === 'status' ? '' : 'hidden'} w-full h-full absolute top-12`}>
          {/* <OutsideClickHandler onOutsideClick={showState === 'status' ? ()=>{setShowState('')} : ()=>{}}> */}
          <div className='w-full left-0 gap-3 absolute bg-gray-800 grid grid-cols-1 p-2 rounded-lg'>
            {
              status.map((stat, index) => {
                const isSelected = selectedStatus.includes(stat)
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
                      <div id={filter.name} ref={(rel) => {otherRefs.current[index] = rel}} className=' w-full h-full absolute'>
                      {/* <OtherFilterDropDown_V2 name={filter.name} options={filter.options} /> */}
                      <div  className='otherFilter w-full max-h-[300px] overflow-auto gap-3 -left-2 absolute bg-gray-800 grid grid-cols-1 top-8 md:top-9 p-2 rounded-lg'>
                        {
                        filter.options?.map((option, index) => {
                          const isSelected = filter.name === 'Season' ? selectedSeason == option : filter.name === 'Year' ? selectedYear == option : selectedType == option
                          // filter.name == 'Season' && console.log( selectedSeason.includes(option), option)
                          return (
                            <button onClick={(e)=>{filter.name === 'Season' ? handleSelectSeason(option) : filter.name === 'Year' ? handleSelectYear(option) : handleSelectType(option); e.stopPropagation()}} key={index} className="text-white text-start text-[0.8rem] cursor-pointer justify-start flex items-center gap-3 hover:text-gray-200">
                              <input type="checkbox" onChange={()=>{}} checked={isSelected} value={option} className='border-0 cursor-pointer'  name="status" id="" />
                              {option}
                            </button>
                          );
                        })
                        }
                      </div>
                    </div>
                    }
                  </div>
                );
              })
            }
            {/* Genre */}
          <div className='flex sm:hidden w-full items-center relative  rounded-lg '>
            <button onClick={()=>{showState === 'genre_v2' ? setShowState( '') : setShowState('genre_v2')}} className='cursor-pointer z-[99999999999] rounded-lg relative p-1 flex bg-gray-800 hover:bg-gray-900 items-center w-full h-full '>
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
            <button onClick={()=>{setShowState(showState === 'theme_v2' ? '' : 'theme_v2')}} className='cursor-pointer relative p-1 flex z-[999999999] items-center w-full h-full '>
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
            <button onClick={()=>{setShowState(showState === 'status_v2' ? '' : 'status_v2')}} className='cursor-pointer relative p-1 flex z-[99999999999] items-center w-full h-full '>
              <p className='ps-1 text-gray-400 text-sm md:text-base '>Status</p>
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
                      const isSelected = selectedStatus.includes(stat)
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
        <button onClick={()=>{handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType);setShowState('')}} className='flex w-fit px-4 md:px-7 lg:w-full text-center justify-center text-white items-center relative bg-pink-500 hover:bg-pink-400 rounded-lg cursor-pointer'>
          Search
        </button>
      </div>
      <div className="w-[90%] mx-auto h-fit gap-5 bg-[#141414] grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {
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
      }
      </div>
    </main>
  )
}

export default Explore