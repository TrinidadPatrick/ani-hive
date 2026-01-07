import React, { useEffect } from 'react'
import LoginButton from '../MalLogin/LoginButton'
import http from '../../http'

const MalProfileDropdown = () => {

    const fetchProfile = async () => {
        try {
            const response = await http.get('mal/anime/watching')
            console.log(response.data)
        } catch (error) {
                console.log(error)
        }
    }

    useEffect(()=>{
        fetchProfile()
    },[])

  return (
    <div>
        <LoginButton />
    </div>
  )
}

export default MalProfileDropdown