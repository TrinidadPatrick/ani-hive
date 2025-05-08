import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const UserLayout = () => {
    const navigate = useNavigate()
  const path = window.location.pathname

  return (
    <>
    <nav className='w-full fixed backdrop-blur z-99999 p-4 flex items-center gap-5'>
            <div className='flex ps-5'>
            <h1 className='text-white text-center text-4xl font-bold'>Ani</h1>
            <h1 className='text-pink-500 text-center text-4xl font-bold'>Hive</h1>
            </div>
            
            <ul className='w-full hidden md:flex text-white justify-end gap-10 pe-10'>
                <li>
                    <button onClick={()=>{navigate('/')}} className={` ${path === '/' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer `}>Home</button>
                </li>
                <li>
                <button onClick={()=>{navigate('/categories')}} className={` ${path === '/categories' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer `}>Categories</button>
                </li>
                <li>
                <button onClick={()=>{navigate('/streaming')}} className={` ${path === '/streaming' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer `}>Streaming</button>
                </li>
                <li>
                <button onClick={()=>{navigate('/forum')}} className={` ${path === '/forum' ? 'border-b-2 border-b-pink-500 text-pink-500 font-bold' : 'text-white'} cursor-pointer `}>Forum</button>
                </li>
            </ul>
        </nav>
        <Outlet />
    </>
  )
}

export default UserLayout