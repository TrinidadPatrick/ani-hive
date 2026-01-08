import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/AuthStore.js'

const PrivateLayout = () => {
    const authenticated = useAuthStore((s) => s.authenticated)

    useEffect(() => {
      if(authenticated === false){
        window.location.href = "/"
      }
    },[authenticated])

  return (
    <div>
        s
        <Outlet />
    </div>
  )
}

export default PrivateLayout