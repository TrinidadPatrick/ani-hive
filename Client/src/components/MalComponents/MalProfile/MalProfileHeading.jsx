import React, { useEffect, useRef } from 'react'
import LoginButton from '../../MalLogin/LoginButton.jsx'
import http from '../../../http.js'
import useAuthStore from '../../../stores/AuthStore.js'
import { CheckCircle, ChevronDown, Clock, Eye, PauseCircle, User } from 'lucide-react'
import { useState } from 'react'
import { useOutsideClick } from '../../../hooks/useOutsideClick.js'

const MalProfileDropdown = () => {
    const ref = useRef(null)
    const authenticated = useAuthStore((s) => s.authenticated)
    const profile = useAuthStore((s) => s.profile)

    const [open, setOpen] = useState(false)

    useOutsideClick(ref, ()=>{
        if (open) setOpen(false)
    })

    if(authenticated === null){
        return null
    }

    return (
    <div className='relative'>
        {
            authenticated === true ?
            (
                <div ref={ref} onClick={()=>setOpen(!open)} className='relative flex gap-1 items-center cursor-pointer'>
                    <div className='w-9 h-9  hover:opacity-90 border border-gray-700 rounded-full'>
                        <img className='' src='https://avatar.iran.liara.run/public' />
                    </div>
                    <ChevronDown color='white' size={20} />

                    {open && <ProfileDropdown profile={profile} setOpen={setOpen} />}
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

const ProfileDropdown = ({profile, setOpen}) => {
    const menuItems = [
        { icon: Eye, label: 'Watching', action: () => console.log('Watching clicked') },
        { icon: CheckCircle, label: 'Completed', action: () => console.log('Completed clicked') },
        { icon: Clock, label: 'Plan to Watch', action: () => console.log('Plan to Watch clicked') },
        { icon: PauseCircle, label: 'On Hold', action: () => console.log('On Hold clicked') },
    ];

    
    return (
        <main className=' bg-slate-800 rounded-lg shadow-xl border border-slate-700 absolute top-10 right-0'>
            <header className='flex items-center px-4 py-3 gap-3'>
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
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
        </main>
    )
}

export default MalProfileDropdown