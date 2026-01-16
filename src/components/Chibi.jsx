import React, { useEffect, useState } from 'react'
import chibi from '../images/chibi.gif'
import { Send, X } from 'lucide-react'
import http from '../http'

const Chibi = ({handleScroll}) => {
    const [isOpen, setisOpen] = useState(false)
    const [messageInput, setMessageInput] = useState('')
    const [chatHistory, setChatHistory] = useState([])
    const [isResponding, setIsResponding] = useState(false)

    const handleSend = async () => {
        setIsResponding(true)
        const newData = [...chatHistory]
        newData.push({role: "user", content: messageInput})
        setChatHistory(newData)

        try {
            const response = await http.post('ask-ai', {message: messageInput, history: newData})
            setChatHistory((prev) => [...prev, {role: "assistant", content: response.data.response}])
        } catch (error) {
            console.log(error)
        } finally {
            setIsResponding(false)
            setMessageInput('')
        }
    }
    
    useEffect(() => {
        console.log(chatHistory)
    },[chatHistory])

  return (
    <div className='fixed w-[150px]  group aspect-square cursor-pointer bottom-2 right-0 z-[999999999]'>
        <img src={chibi} alt="chibi" className=' w-full h-full object-cover ' />
            <div className="absolute bottom-[75%] right-[30%]">
                <div className="w-sm aspect-square relative bg-themeDark  overflow-hidden text-sm flex flex-col text-white rounded-lg shadow-lg origin-bottom ">
                {/* Header */}
                <div className='w-full flex bg-pink-600 p-4 gap-3'>
                    {/* Aki image */}
                    <div className='w-10 h-10 rounded-full bg-white'>

                    </div>
                    {/* Name and subtitle */}
                    <div className='flex flex-col flex-1'>
                        <h2 className='text-xl font-medium leading-5'>Aki-chan</h2>
                        <h4 className='text-sm'>Your anime guide</h4>
                    </div>
                    {/* Close button */}
                    <div className='h-full flex items-center'>
                        <button className='bg-white/20 hover:bg-gray-200/20 rounded-full p-1 cursor-pointer'><X /></button>
                    </div>
                </div>

                {/* Message Body */}
                <section className='flex-1 bg-themeDarkest overflow-y-auto flex flex-col gap-2'>
                {
                    chatHistory.length > 0 && chatHistory?.map((chat, index) => {
                        return (
                            <div className={`w-full flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} `}>
                                <span className='max-w-xs px-2 py-1 bg-themeDark rounded-lg'>{chat.content}</span>
                            </div>
                        )
                    })
                }
                </section>

                {/* Message input box */}
                <section className=' bg-themeDarker border-t border-themeLightDark flex gap-2 p-2'>
                    <input disabled={isResponding} onKeyDown={(e) => {if(e.key === 'Enter'){handleSend()}}} value={messageInput} onChange={(e)=> setMessageInput(e.target.value)} className='bg-themeDark w-full rounded-full px-3 py-1 outline-none border border-gray-700' type='text' placeholder='Enter message..' />
                    <button className='bg-pink-600 px-3 py-1 rounded-md'><Send className='text-white' width={15} /></button>
                </section>

                <div className="arrow-pointer absolute left-[70%] -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-themeDark" />
                </div>
            </div>
      </div>
  )
}

export default Chibi