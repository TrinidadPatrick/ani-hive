import React, { useEffect, useRef } from 'react'
import LoginButton from '../../MalLogin/LoginButton.jsx'
import http from '../../../http.js'
import useAuthStore from '../../../stores/AuthStore.js'
import { CheckCircle, ChevronDown, Clock, Droplet, Eye, LogOut, PauseCircle, TicketX, User } from 'lucide-react'
import { useState } from 'react'
import { useOutsideClick } from '../../../hooks/useOutsideClick.js'
import {useNavigate} from 'react-router-dom'

const MalProfileDropdown = () => {
    const ref = useRef(null)
    const authenticated = useAuthStore((s) => s.authenticated)
    const profile = useAuthStore((s) => s.profile)
    const logout = useAuthStore((s) => s.logout)

    const [open, setOpen] = useState(false)

    useOutsideClick(ref, ()=>{
        if (open) setOpen(false)
    })

    if(authenticated === null){
        return null
    }

    const handleLogout = () => {
        console.log("Hello")
    }

    return (
    <div className='relative'>
        {
            authenticated === true ?
            (
                <div ref={ref} onClick={()=>setOpen(!open)} className='relative flex gap-1 items-center cursor-pointer z-90'>
                    <div className='w-9 h-9  hover:opacity-90 border border-gray-700 rounded-full'>
                        <img className='' src='https://avatar.iran.liara.run/public' />
                    </div>
                    <ChevronDown color='white' size={20} />

                    {open && <ProfileDropdown profile={profile} setOpen={setOpen} logout={logout} />}
                </div>
            )
            : 
            (
                <LoginButton />
            )
        }
    </div>
  )
}

const ProfileDropdown = ({profile, setOpen, logout}) => {
    const navigate = useNavigate()
    const menuItems = [
        { icon: Eye, label: 'Watching', action: () => navigate('/user/anime-list/watching'), className: 'text-slate-400' },
        { icon: CheckCircle, label: 'Completed', action: () => navigate('/user/anime-list/completed'), className: 'text-slate-400' },
        { icon: Clock, label: 'Plan to Watch', action: () => navigate('/user/anime-list/plan_to_watch'), className: 'text-slate-400' },
        { icon: PauseCircle, label: 'On Hold', action: () => navigate('/user/anime-list/on_hold'), className: 'text-slate-400' },
        { icon: TicketX, label: 'Dropped', action: () => navigate('/user/anime-list/dropped') , className: 'text-slate-400' },
        { icon: LogOut, label: 'Logout', action: () => logout(), className: 'text-red-500' },
    ];

    
    return (
        <main className='bg-slate-800 rounded-lg shadow-xl border border-slate-700 absolute top-10 right-0 z-[999999999999999]'>
            <header className='flex items-center px-4 py-3 gap-3 border-b border-b-slate-600'>
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium whitespace-nowrap text-slate-200">{profile?.name}</h3>
            </header>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors duration-150 text-left cursor-pointer"
                >
                  <Icon className={`w-5 h-5 ${item.className}`} />
                  <span className={`font-medium whitespace-nowrap ${item.className}`}>{item.label}</span>
                </button>
              );
            })}
        </main>
    )
}

export default MalProfileDropdown