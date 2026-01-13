import React from 'react'

const LoaderV2 = ({width = 10, height = 10, color = ''}) => {
  return (
    <div className="flex flex-row gap-2">
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}} className={` rounded-full ${color} animate-bounce`}></div>
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}}
        className={` rounded-full ${color} animate-bounce [animation-delay:-.3s]`}
    ></div>
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}}
        className={` rounded-full ${color} animate-bounce [animation-delay:-.5s]`}
    ></div>
    </div>
  )
}

export default LoaderV2