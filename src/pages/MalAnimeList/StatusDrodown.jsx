import { CheckCircle, ChevronDown, Clock, Eye, PauseCircle, TicketX } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useOutsideClick } from '../../hooks/useOutsideClick';

const StatusDrodown = ({selectedWatchStatus, setSelectedWatchStatus, buttonClassname, dropdownClassname, textClassname, titleClassname, arrowClassname, arrowSize, dropdownButtonClassname, action}) => {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const statusItems = [
        { icon: Eye, label: 'Watching', value: 'watching'},
        { icon: CheckCircle, label: 'Completed', value: 'completed'},
        { icon: Clock, label: 'Plan to watch', value: 'plan_to_watch'},
        { icon: PauseCircle, label: 'On hold', value: 'on_hold'},
        { icon: TicketX, label: 'Dropped', value: 'dropped'},
    ];

    const handleStatusClick = (item) => {
        setSelectedWatchStatus(item.value)
        if(action){
            action(item.value)
        }
    }

    useOutsideClick(ref, ()=>{
            if (isOpen) setIsOpen(false)
    })


  return (
    <div ref={ref} onClick={(e)=>{e.stopPropagation();setIsOpen(!isOpen)}} className={buttonClassname}>
        <span className={`capitalize whitespace-nowrap ${titleClassname}`}>{selectedWatchStatus.replaceAll("_", " ")}</span>

        <ChevronDown className={`${arrowClassname}`} width={arrowSize}  />

        {
            isOpen &&
            (
                <div className={` absolute z-[999999999999999] top-12 left-0 rounded-lg gap-2 flex flex-col ${dropdownClassname}`}>
            {
                statusItems.map((item, index)=> {
                    return (
                        <button onClick={()=>{handleStatusClick(item)}} key={index} className={`flex items-center gap-2 cursor-pointer py-1 px-2 ${dropdownButtonClassname}`}>
                            <item.icon className={`flex-none ${textClassname}`} width={15} />
                            <span className={` whitespace-nowrap ${textClassname}`}>{item.label}</span>
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