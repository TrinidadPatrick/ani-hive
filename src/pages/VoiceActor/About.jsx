import React from 'react'

const About = ({personInfo}) => {   
    const {about} = personInfo
    
    return (
        <div className='flex flex-col gap-2 rounded-lg w-full p-6 bg-themeDark border border-themeLightDark'>
            <header className='text-gray-200 font-medium text-lg flex gap-2'><div className='w-1 h-full bg-pink-600' />About</header>
            <p className='text-gray-300 whitespace-pre-wrap mt-2'>
                {about}
            </p>
        </div>
    )
}

export default About