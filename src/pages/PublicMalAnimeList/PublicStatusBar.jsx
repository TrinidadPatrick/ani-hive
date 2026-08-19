import { CheckCircle, ChevronDown, Clock, Eye, PauseCircle, TicketX } from 'lucide-react';
import useAuthStore from '../../stores/AuthStore';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const PublicStatusBar = ({status, username, setScrollPosition, scrollPosition}) => {
    const navigate = useNavigate()
    const statusItems = [
        { icon: Eye, label: 'Watching', value: 'watching'},
        { icon: Clock, label: 'Plan to watch', value: 'plan_to_watch'},
        { icon: CheckCircle, label: 'Completed', value: 'completed'},
        { icon: PauseCircle, label: 'On hold', value: 'on_hold'},
        { icon: TicketX, label: 'Dropped', value: 'dropped'},
    ];
    
    if(username === null || !status) return null

  return (
    <div className='w-full p-2 sm:p-4 flex my-2 md:py-1'>
        {/* Status items */}
        <div className='flex gap-2 lg:gap-3 overflow-x-scroll statusList'>
            {
                statusItems.map((item, index) => {
                    return (
                        <Link preventScrollReset={true} to={`/user-list/${username}/${item.value}`} onClick={() => {setScrollPosition({...scrollPosition, userList: null})}} key={index} className={`text-xs sm:text-sm flex items-center px-2 py-1 sm:py-2 ${item.value === status ? 'bg-pink-600 text-gray-200' : 'text-gray-400 hover:text-gray-500'}  cursor-pointer rounded-full`}>
                            <span className='whitespace-nowrap'>{item.label}</span>
                        </Link>
                    )
                })
            }
        </div>
    </div>
  )
}

export default PublicStatusBar