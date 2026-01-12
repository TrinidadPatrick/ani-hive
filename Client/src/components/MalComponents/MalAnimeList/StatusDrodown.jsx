import { CheckCircle, ChevronDown, Clock, Eye, PauseCircle, TicketX } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useOutsideClick } from '../../../hooks/useOutsideClick';

const StatusDrodown = ({selectedWatchStatus, setSelectedWatchStatus, background, border, textColor, action}) => {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const statusItems = [
        { icon: Eye, label: 'Watching', value: 'watching'},
        { icon: CheckCircle, label: 'Completed', value: 'completed'},
        { icon: Clock, label: 'Plan to watch', value: 'plan_to_watch'},
        { icon: PauseCircle, label: 'On hold', value: 'on_hold'},
        { icon: TicketX, label: 'Dropped', value: 'dropped'},
    ];

    const handleStatusClick = (status) => {
        setSelectedWatchStatus(status)
    }

    useOutsideClick(ref, ()=>{
            if (isOpen) setIsOpen(false)
    })


  return (
    <div ref={ref} onClick={(e)=>{e.stopPropagation();;setIsOpen(!isOpen)}} className={`bg-${background} border border-${border} h-full px-2 flex items-center justify-between rounded-lg relative gap-2 cursor-pointer hover:bg-${background}/20`}>
        <span className={`text-${textColor} capitalize text-sm whitespace-nowrap`}>{selectedWatchStatus.replaceAll("_", " ")}</span>

        <ChevronDown className={`text-${textColor}`} width={20}  />

        {
            isOpen &&
            (
                <div className='w-full absolute bg-[#25252D] z-[999999999999999] top-12 left-0 rounded-lg gap-2 flex flex-col'>
            {
                statusItems.map((item, index)=> {
                    return (
                        <button onClick={()=>{handleStatusClick(item.value);action(item.value)}} key={index} className='flex items-center gap-2 cursor-pointer hover:bg-[#1b1b1b] py-1 px-2'>
                            <item.icon className={`text-${textColor}  flex-none`} width={15} />
                            <span className={`text-${textColor}  text-sm whitespace-nowrap`}>{item.label}</span>
                        </button>
                    )
                })
            }
        </div>
            )
        }
    </div>
  )
}

export default StatusDrodown