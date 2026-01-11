import { Star, X } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "framer-motion";

const ScorePicker = ({score, setScore}) => {
    const [isOpen, setIsOpen] = useState(false)
    const scores = [
        { value: 1, label: "Unrated" },
        { value: 2, label: "Awful" },
        { value: 3, label: "Poor" },
        { value: 4, label: "Below Average" },
        { value: 5, label: "Average" },
        { value: 6, label: "Fine" },
        { value: 7, label: "Good" },
        { value: 8, label: "Very Good" },
        { value: 9, label: "Excellent" },
        { value: 10, label: "Masterpiece" }
    ];

    const ScoreModal = () => {
        if(!isOpen) return null
        return (
             <main onClick={(e) => e.stopPropagation()} className='fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.2)]'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ 
                    type: "spring", 
                    damping: 25, 
                    stiffness: 300 
                    }}
                    className='bg-slate-900 p-4 w-sm rounded-lg shadow-2xl absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                >
                <div className=''>
                    <button onClick={(e)=>{e.stopPropagation();setIsOpen(false);}} className='text-white absolute right-5 cursor-pointer hover:text-gray-300'><X width={17} /></button>
                    <h2 className='font-bold text-xl text-white text-center pb-3'>Select Rating</h2>
                    <div className='flex flex-col gap-2'>
                        {
                            scores.reverse().map((score, index) =>{
                                return (
                                    <button key={index} onClick={()=>{setScore(score.value);setIsOpen(false)}} className='text-white bg-slate-800 hover:bg-slate-700 cursor-pointer px-4 py-2 rounded-lg text-start text-sm'>{score.value} - {score.label}</button>
                                )
                            })
                        }
                    </div>
                </div>
                </motion.div>
             </main>
        )
    }

    return (
    <div className='h-full relative'>
        <button onClick={(e)=>{e.stopPropagation();setIsOpen(true)}} className=" flex items-center gap-1 rounded-lg bg-[#25252D] hover:bg-[#1b1b1b] border border-[#37373b] px-2 h-full cursor-pointer">
            <Star className="h-3 w-3 fill-pink-600 text-pink-600" width={30} />
            <span className="text-xs font-medium text-white">{score}</span>
        </button>
        <ScoreModal />
    </div>
    )
}

export default ScorePicker