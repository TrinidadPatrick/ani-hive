import { CheckCircle, ChevronDown, Clock, Eye, PauseCircle, TicketX } from 'lucide-react';
import useAuthStore from '../../../stores/AuthStore';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';

const StatusBar = ({status, setScrollPosition, scrollPosition}) => {
    const profile = useAuthStore((s) => s.profile)
    const navigate = useNavigate()
    const statusItems = [
        { icon: Eye, label: 'Watching', value: 'watching'},
        { icon: CheckCircle, label: 'Completed', value: 'completed'},
        { icon: Clock, label: 'Plan to watch', value: 'plan_to_watch'},
        { icon: PauseCircle, label: 'On hold', value: 'on_hold'},
        { icon: TicketX, label: 'Dropped', value: 'dropped'},
    ];
    
    if(profile === null) return null

  return (
    <div className='w-full p-4 flex'>
        {/* Status items */}
        <div className='flex gap-3 flex-wrap'>
            {
                statusItems.map((item, index) => {
                    return (
                        <button onClick={() => {setScrollPosition({...scrollPosition, userList: null});navigate(`/user/anime-list/${item.value}`)}} key={index} className={`flex items-center px-3 py-2 ${item.value === status ? 'bg-pink-600 text-gray-200' : 'text-gray-400 hover:text-gray-500'}  cursor-pointer rounded-full text-sm`}>
                            <span>{item.label}</span>
                            <div className='ml-2 bg-slate-200/10 rounded-full px-2 py-0.5 flex items-center justify-center'>{profile.anime_statistics[`num_items_${item.value}`]}</div>
                        </button>
                    )
                })
            }
        </div>
    </div>
  )
}

export default StatusBar