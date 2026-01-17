import React from 'react'

const About = ({content, nicknames}) => {
  return (
    <div className=''>
        <h3 className='font-medium text-lg text-gray-300'>Nicknames</h3>
        <div className='flex items-center gap-2 w-full overflow-x-auto flex-wrap'>
            {
                nicknames.length > 0 && 
                nicknames.map((name, index) => {
                    return (
                        <div key={index} className='text-gray-300 bg-themeDark px-3 py-1 rounded-full text-sm'>{name}</div>
                    )
                })
            }
        </div>
        <p className='text-gray-300 whitespace-pre-wrap mt-3'>{content}</p>
    </div>
  )
}

export default About