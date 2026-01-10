import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/AuthStore.js'

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
    </div>
  )
}

export default PrivateLayout