import React from 'react'

const LoaderV2 = ({width, height, color}) => {
  return (
    <div class="flex flex-row gap-2">
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}} class={` rounded-full ${color} animate-bounce`}></div>
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}}
        class={` rounded-full ${color} animate-bounce [animation-delay:-.3s]`}
    ></div>
    <div style={{width: width.toString() + 'px', height: height.toString()+ 'px'}}
        class={` rounded-full ${color} animate-bounce [animation-delay:-.5s]`}
    ></div>
    </div>
  )
}

export default LoaderV2