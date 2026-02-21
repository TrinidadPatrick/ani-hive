import { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import useScrollPosition from "../../stores/ScrollPositionStore";
import { Search, X } from "lucide-react";

const ExploreNavbar = (props) => {
  const {selectedSortItem,setSelectedGenres,setShowOtherFilter, otherFilters, setSearching, setShowSort,sortItems, setSelectedStatus, setSelectedSeason, setSelectedYear, setSelectedType,otherRefs, setSelectedSortItem, searchValue, selectedGenres, showState, setShowState, genres, themes, selectedStatus, status, showSort, showOtherFilter, setSearchValue, handleSearch, selectedSeason,selectedYear, selectedType} = props
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const scrollPosition = useScrollPosition((s) => s.scrollPosition)
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition)

  const isClearFilterDisabled = () => {
  return selectedGenres.length == 0 && selectedStatus == '' && selectedSeason == '' && selectedYear == '' && selectedType == '' && selectedSortItem.order_by == ''
  }

  const handleSelectedOrderBy = (orderBy) => {
    setSelectedSortItem({...selectedSortItem, order_by: orderBy === selectedSortItem.order_by ? '' : orderBy})
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

  const handleHideDropdowns = () => {
      setShowState('')
      setShowOtherFilter(false)
      setShowSort(false)
  }

  const handleClear = () => {
        setSearching(true)
        setScrollPosition({...scrollPosition, explore : null})
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
        setShowOtherFilter(false)
  }

  return (
    <div onClick={(e)=> e.stopPropagation()} className=" w-[95%]  lg:w-[90%] flex gap-y-7 gap-x-2 py-2 z-[9999]">
            {/* Search Bar */}
            <div className='flex w-full gap-3 items-center relative'>
              <button onClick={()=>{handleHideDropdowns();setSearching(true);setScrollPosition({...scrollPosition, explore : null});handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, 1)}} className="text-gray-400 absolute left-3 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
                <Search width={17} />
              </button>
              <input onClick={handleHideDropdowns} onKeyDown={(e)=>{if(e.key === 'Enter') {handleHideDropdowns();setSearching(true);setScrollPosition({...scrollPosition, explore : null});handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, 1)}}} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} type="text" className=" outline-0 w-full ps-10 h-10 bg-themeDark border border-themeDark rounded-lg text-white placeholder:text-gray-400 placeholder:text-sm" placeholder="Search anime..." />
              <button onClick={()=>{handleHideDropdowns();setSearching(true);setSearchValue('');setScrollPosition({...scrollPosition, explore : null});handleSearch('', selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, 1)}} className={`text-gray-400 absolute right-3 ${searchValue.length === 0 && 'hidden'} cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200`}>
                <X width={17} />
              </button>
            </div>
            {/* Genre */}
            <div className='hidden sm:flex w-full items-center relative bg-themeDark border border-themeDark hover:outline-pink-500 hover:outline rounded-lg cursor-pointer'>
              <div onClick={()=>{setShowState(showState === 'genre' ? '' : 'genre');setShowSort(false);setShowOtherFilter(false)}} className=' overflow-hidden cursor-pointer relative p-1 flex  items-center w-full h-full '>
              <p className='truncate ps-2 text-gray-400 whitespace-nowrap'>Genre</p>
              <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </button>
              </div>
              
              <div className={`${showState === 'genre' ? '' : 'hidden'} w-fit h-fit absolute top-12 z-[99999999999999] `}>
                <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[400px] gap-3  bg-themeDarker border border-themeDark grid grid-cols-2 md:grid-cols-4 left-0 top-12 p-2 rounded-lg'>
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
              </div>
            </div>
            {/* Theme */}
            <div className='hidden md:flex w-full items-center relative bg-themeDark border border-themeDark hover:outline-pink-500 hover:outline rounded-lg cursor-pointer'>
              <div onClick={()=>{setShowState(showState === 'theme' ? '' : 'theme');setShowSort(false);setShowOtherFilter(false)}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
              <p className='ps-2 text-gray-400'>Theme</p>
              <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </button>
              </div>
              <div className={`${showState === 'theme' ? '' : 'hidden'} w-full h-full absolute top-12 `}>
              {/* <OutsideClickHandler onOutsideClick={showState === 'theme' ? ()=>{setShowState('')} : ()=>{}}> */}
              <div className='w-full md:w-[500px] overflow-auto lg:w-[500px] max-h-[400px] gap-3 bg-themeDarker border border-themeDark scrollbar grid grid-cols-2 md:grid-cols-3 right-0 lg:left-0 top-12 p-2 rounded-lg'>
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
            <div className='w-full hidden lg:flex items-center relative bg-themeDark border border-themeDark hover:outline-pink-500 hover:outline rounded-lg cursor-pointer'>
              <div onClick={()=>{setShowState(showState === 'status' ? '' : 'status');setShowSort(false);setShowOtherFilter(false)}} className='cursor-pointer relative p-1 flex  items-center w-full h-full '>
              <p className='ps-2 text-gray-400'>{selectedStatus == '' ? 'Status' : selectedStatus}</p>
              <button className="text-white absolute right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
              </button>
              </div>
              <div className={`${showState === 'status' ? '' : 'hidden'} w-full h-full absolute top-12`}>
              <div className='w-full left-0 gap-3 absolute bg-themeDarker border border-themeDark grid grid-cols-1 p-2 rounded-lg'>
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
            </div>
    
            {/* Sort */}
            <div className='flex w-fit px-1 items-center relative bg-themeDark border border-themeDark hover:outline-pink-500 hover:outline rounded-lg cursor-pointer'>
              <div onClick={()=>{setShowSort(!showSort);setShowState(false);setShowOtherFilter(false)}} className='cursor-pointer z-[99999999999] relative p-1 flex  items-center w-full h-full '>
              <button className="text-white right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/></svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14H2m6-4H2m4-4H2m10 12H2m17 2V4m0 16l3-3m-3 3l-3-3m3-13l3 3m-3-3l-3 3"/></svg>
              </button>
              </div>
              {
                showSort &&
              <div className=' w-full h-full absolute -right-15'>
                  <div className='flex flex-col w-[300px] xs:w-[350px] -right-20 xs:right-0 absolute bg-themeDarker top-12 rounded-lg overflow-hidden'>
                    <div className='w-full bg-themeDark p-2 flex gap-3 items-center justify-between'>
                      <span className='text-gray-400 text-sm uppercase'>Sort options</span>
                        <div className='flex items-center gap-2'>
                        <button onClick={()=>handleSelectedSortBy('asc')} className={`${selectedSortItem.sort_by === 'asc' ? 'bg-themeDarker' : 'bg-themeDark' } cursor-pointer  px-2 py-1 text-gray-400 rounded text-sm`}>Asc </button>
                        <button onClick={()=>handleSelectedSortBy('desc')} className={`${selectedSortItem.sort_by === 'desc' ? 'bg-themeDarker' : 'bg-themeDark' } cursor-pointer  px-2 py-1 text-gray-400 rounded text-sm`}> Desc</button>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 w-full p-2 gap-0'>
                    {
                      sortItems.map((item, index) => {
                        return (
                          <div onClick={()=>handleSelectedOrderBy(item.value)} key={index} className={`flex gap-1 z-[999999999] w-full items-center relative py-2 px-2 rounded-lg cursor-pointer`}>
                            <input readOnly type='checkbox' checked={selectedSortItem.order_by === item.value} />
                            <p className='text-gray-400 text-sm text-start w-full'>{item.key}</p>
                          </div>
                        );
                      })
                    }
                    </div>
                  </div>
              </div>
              }
            </div>
    
            {/* Other Filter */}
            <div className='flex w-fit px-1 items-center relative bg-themeDark border border-themeDark hover:outline-pink-500 hover:outline rounded-lg cursor-pointer'>
              <div onClick={()=>{setShowOtherFilter(!showOtherFilter);setShowState(false);setShowSort(false)}} className='cursor-pointer z-[99999999999] relative p-1 flex  items-center w-full h-full '>
              <button className="text-white right-2 cursor-pointer justify-center flex items-center gap-3 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="lightgray" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/></svg>
              </button>
              </div>
              {
                showOtherFilter &&
                <div className=' w-full h-full absolute'>
                  <div className='w-[300px] xs:w-[350px] -right-20 xs:right-0 gap-3 absolute bg-themeDarker grid grid-cols-3 top-12 p-2 rounded-lg'>
                    {
                      otherFilters.map((filter, index) => {
                        // const isSelected = selectedStatus.includes(stat)
                        return (
                          <div key={index} onClick={()=>{setShowState(filter.name == showState ? '' : filter.name)}} className='flex z-[999999999] w-full items-center relative bg-themeDark hover:outline hover:outline-pink-600 py-1 px-2 rounded-lg cursor-pointer'>
                            <p className='text-gray-400 text-sm md:text-base text-start w-full'>{filter.name}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="lightGray" d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"/></svg>
                            {
                              showState === filter.name &&
                              <div id={filter.name} ref={(rel) => {otherRefs.current[index] = rel}} className=' w-full h-full absolute z-[99999999999999999999999999999] '>
                              {/* <OtherFilterDropDown_V2 name={filter.name} options={filter.options} /> */}
                              <div  className='otherFilter z-[9999999999999999999999999999999] w-full max-h-[300px] overflow-auto gap-3 -left-2 absolute bg-themeDark grid grid-cols-1 top-8 md:top-9 p-2 rounded-lg'>
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
                  <div onClick={handleClear} className=' sm:hidden col-span-3  flex justify-end border-t pt-2 border-gray-600'>
                    <button className='text-sm text-gray-400 cursor-pointer'>Clear filter</button>
                  </div>
                  </div>
                </div>
              }
              
            </div>
    
            {/* Search button */}
            <button onClick={()=>{handleHideDropdowns();setSearching(true);setScrollPosition({...scrollPosition, explore : null});handleSearch(searchValue, selectedGenres, selectedStatus, selectedSeason, selectedYear, selectedType, selectedSortItem.order_by, selectedSortItem.sort_by, 1);setShowState('')}} 
            className='flex w-fit px-4 md:px-10 lg:w-fit text-center justify-center text-white items-center relative bg-pink-600 hover:bg-pink-500 rounded-lg cursor-pointer'>
              Apply
            </button>
            {/* Clear Filter button */}
            <button disabled={isClearFilterDisabled()} onClick={()=>{handleClear()}} 
            className='hidden sm:flex w-fit px-3 md:px-5 lg:w-fit disabled:bg-gray-400 disabled:cursor-default whitespace-nowrap text-center justify-center text-gray-500 items-center relative bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer'>
              {
                screenWidth > 600 ? 'Clear filter' :
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048"><path fill="currentColor" d="M0 128h2048v219l-768 768v805H768v-805L0 347zm1920 165v-37H128v37l768 768v731h256v-731zm37 987l91 91l-230 229l230 229l-91 91l-229-230l-229 230l-91-91l230-229l-230-229l91-91l229 230z"/></svg>
              }
            </button>
          </div>
  )
}

export default ExploreNavbar