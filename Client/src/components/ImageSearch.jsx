import axios from 'axios'
import { Camera } from 'lucide-react'
import React, { useRef, useState } from 'react'

const ImageSearch = () => {
    const [image, setImage] = useState(null)
    const fileInputRef = useRef()

    const handleImageUpload = async (e) => {
        const image = e.target.files[0]
        setImage(image)
        
        const formData = new FormData()
        formData.append("image", image)
        const result = await axios.post("https://api.trace.moe/search", formData)
        console.log(result.data)
    }

  return (
    <div className='flex items-center px-2 mx-1 cursor-pointer'>
        <button onClick={()=>fileInputRef.current.click()} className='cursor-pointer'>
            <Camera color='white' />
        </button>
        <input accept='image/*' onChange={(e)=>handleImageUpload(e)} ref={fileInputRef} type='file' className='hidden' />
    </div>
  )
}

export default ImageSearch