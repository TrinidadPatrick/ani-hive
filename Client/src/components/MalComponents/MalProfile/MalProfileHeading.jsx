import React, { useEffect } from 'react'
import LoginButton from '../../MalLogin/LoginButton.jsx'
import http from '../../../http.js'
import useAuthStore from '../../../stores/AuthStore.js'

const MalProfileDropdown = () => {
    const authenticated = useAuthStore((s) => s.authenticated)

    if(authenticated === null){
        return null
    }

    return (
    <div className='relative'>
        {
            authenticated === true ?
            (
                <div>Profile</div>
            )
            : 
            (
                <LoginButton />
            )
        }
    </div>
  )
}

export default MalProfileDropdown