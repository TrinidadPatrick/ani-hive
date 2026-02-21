import React, { useEffect, useState, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Components
import ImageSearch from '../../components/ImageSearch.jsx';
import MalProfileDropdown from '../../components/MalComponents/MalProfile/MalProfileHeading.jsx';
import MainHandler from '../../components/ErrorHandlerComponent/MainHandler.jsx';

// Stores
import useAuthStore from '../../stores/AuthStore.js';
import useErrorHandler from '../../stores/FetchErrorHandler.js';
import { SearchIcon } from 'lucide-react';

const UserLayout = () => {
  const errors = [404, 504, 400];
  const errorStatus = useErrorHandler((s) => s.errorStatus);
  const setErrorStatus = useErrorHandler((s) => s.setErrorStatus);
  
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [searchinput, setSearchInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Reset error status on route change
  useEffect(() => {
    if (errorStatus) setErrorStatus(null);
  }, [location]);

  // PWA Register
  useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered');
    },
  });

  // AOS Animation Init
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 200,
    });
  }, []);

  // Screen resize listener
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const handleSearch = () => {
    setSearchInput('');
    setShowSidebar(false);
    navigate(`/explore?page=1&q=${searchinput}`);
  };

  return (
    <main>
      {/* Mobile Sidebar */}
      {showSidebar && (
        <div
          data-aos="fade-left"
          data-aos-easing="ease-in"
          className="w-full flex md:hidden flex-col justify-center gap-5 h-[100svh] fixed bg-[#141414] z-[99999999]"
        >
          <div>
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute md:hidden top-3 right-3 px-1 py-0.5 rounded"
            >
              <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path fill="currentColor" d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z" />
                </g>
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex ps-5 cursor-pointer w-full justify-center">
            <h1 className="text-white text-center text-4xl font-bold">Ani</h1>
            <h1 className="text-pink-500 text-center text-4xl font-bold">Hive</h1>
          </div>

          {/* Sidebar Search */}
          <div className={`${path === '/explore' && 'hidden'} w-[80%] flex mx-auto justify-center`}>
            <div className="w-full max-w-sm min-w-[200px] flex gap-2">
              <ImageSearch />
              <div className="relative w-full">
              <input
                onKeyDown={(e) => { if (e.key === 'Enter' && searchinput?.length !== 0) handleSearch(); }}
                value={searchinput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-gray-200 text-sm rounded-full bg-themeDark pl-10 sm:pr-14 lg:pr-28 py-2 focus:outline-none transition duration-300 placeholder:text-gray-400"
                placeholder="Search anime..."
              />
              <button
                onClick={() => { if (searchinput?.length !== 0) handleSearch(); }}
                className="cursor-pointer absolute top-0 left-1 flex items-center justify-center rounded py-1.5 px-2.5 text-gray-400 hover:text-gray-200 transition-all"
                type="button"
              >
                <SearchIcon className='' width={16} />
              </button>
            </div>
            </div>
          </div>

          {/* Nav menus */}
          <ul className="w-full justify-center items-center flex flex-col md:hidden text-white gap-5">
            <li>
              <button
                onClick={() => { navigate('/'); setShowSidebar(false); }}
                className={`${path === '/' || path.startsWith('/anime/') ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigate('/schedule'); setShowSidebar(false); }}
                className={`${path === '/schedule' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer`}
              >
                Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigate('/explore'); setShowSidebar(false); }}
                className={`${path === '/explore' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer`}
              >
                Explore
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigate('/characters'); setShowSidebar(false); }}
                className={`${path === '/characters' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer`}
              >
                Characters
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="w-full fixed backdrop-blur z-[9999] p-4 flex justify-between items-center gap-5">
        <div className='w-full h-full absolute  bg-black/10' />
        <div onClick={() => navigate('/')} className="w-full flex ps-5 cursor-pointer relative z-10">
          <h1 className="text-white text-center text-4xl font-bold">Ani</h1>
          <h1 className="text-pink-500 text-center text-4xl font-bold">Hive</h1>
        </div>

        {/* Desktop Links */}
        <ul className="w-full hidden md:flex text-white justify-end gap-5 lg:gap-10 pe-10 z-10">
          <li>
            <button onClick={() => navigate('/')} className={`${path === '/' || path.startsWith('/anime/') ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-gray-300 font-sans'} cursor-pointer text-sm lg:text-base`}>Home</button>
          </li>
          <li>
            <button onClick={() => navigate('/schedule')} className={`${path === '/schedule' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-gray-300 font-sans'} cursor-pointer text-sm lg:text-base`}>Schedule</button>
          </li>
          <li>
            <button onClick={() => navigate('/explore')} className={`${path === '/explore' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-gray-300 font-sans'} cursor-pointer text-sm lg:text-base`}>Explore</button>
          </li>
          <li>
            <button onClick={() => navigate('/characters')} className={`${path === '/characters' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-gray-300 font-sans'} cursor-pointer text-sm lg:text-base`}>Characters</button>
          </li>
        </ul>

        {/* Desktop Search */}
        <div className="hidden w-full justify-end sm:flex">
          <div className={`w-full ${path === '/explore' ? 'hidden' : 'sm:flex'} max-w-sm min-w-[200px] gap-2`}>
            <ImageSearch />
            <div className="relative w-full">
              <input
                onKeyDown={(e) => { if (e.key === 'Enter' && searchinput?.length !== 0) handleSearch(); }}
                value={searchinput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-gray-200 text-sm rounded-full bg-themeDark pl-10 sm:pr-14 lg:pr-28 py-2 focus:outline-none transition duration-300 placeholder:text-gray-400"
                placeholder="Search anime..."
              />
              <button
                onClick={() => { if (searchinput?.length !== 0) handleSearch(); }}
                className="cursor-pointer absolute top-0 left-1 flex items-center justify-center rounded py-1.5 px-2.5 text-gray-400 hover:text-gray-200 transition-all"
                type="button"
              >
                <SearchIcon className='' width={16} />
              </button>
            </div>
          </div>
        </div>

        <MalProfileDropdown />

        <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden h-full bg-pink-500 px-1 py-0.5 rounded z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
            <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" />
          </svg>
        </button>
      </nav>

      {/* Main Content Area */}
      <ToastContainer />
      {errors.includes(errorStatus) ? (
        <MainHandler status={errorStatus} />
      ) : (
        <Outlet />
      )}
    </main>
  );
};

export default UserLayout;