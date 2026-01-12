import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/AuthStore.js'
import chibi from '../../images/chibi.gif'

const PrivateLayout = () => {
    const authenticated = useAuthStore((s) => s.authenticated)
    const isAuthenticating = useAuthStore((s) => s.isAuthenticating)

    useEffect(() => {
      if(authenticated === false){
        window.location.href = "/"
      }
    },[authenticated])
    
    if(isAuthenticating) return null

  return (
    <div className='w-full h-[100svh]'>
        <Outlet />
        <div onClick={()=>{window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })}} className='fixed w-[100px] md:w-[150px] aspect-square cursor-pointer bottom-2 right-0 z-[999999999]'>
          <img src={chibi} alt="chibi" className='peer w-full h-full object-cover' />
          <div className="absolute hidden peer-hover:block top-0 left-1/2 transform -translate-x-1/2">
          <div className="relative bg-white text-black px-3 py-1 rounded-full shadow-lg">
            <button className="font-semibold whitespace-nowrap">Go to Top</button>

            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default PrivateLayout