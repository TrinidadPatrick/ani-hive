import axios from 'axios'
import { Camera } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from './Loader'

const ImageSearch = () => {
    const [isSearching, setIsSearching] = useState(false)
    const fileInputRef = useRef()
    const navigate = useNavigate()

    const toastOption = {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }

    const fetchAnimeId = async (animeId) => {
    try {
        const anilistQuery = `
        query ($id: Int) {
            Media(id: $id) {
            id
            idMal
            title {
                romaji
                english
                native
            }
            }
        }
        `;

        const response = await axios.post('https://graphql.anilist.co', {
        query: anilistQuery,
        variables: { id: animeId }
        });

        const idMal = response.data.data.Media.idMal;

        if (!idMal) {
        console.warn(`No MAL ID found for ${animeTitle}`);
        return null;
        }

        return idMal

    } catch (error) {
        console.error('Error fetching anime details:', error);
        return null;
    }
    };     

    const handleImageUpload = async (e) => {
        setIsSearching(true)
        const image = e.target.files[0]
        
        const formData = new FormData()
        formData.append("image", image)
    
        e.target.value = '' //reset the input file

        try {
          const result = await axios.post("https://api.trace.moe/search", formData)
          const anilist_id = result.data.result[0].anilist
          const similarity = result.data.result[0].similarity * 100
          if(anilist_id){
            if(similarity >= 90){
              const mal_id = await fetchAnimeId(anilist_id)
              if(mal_id) return window.location.href = `/anime/${mal_id}`
            }else{
               toast.warn("No anime found with the given image, please try a different image", toastOption);
            }
          }
        } catch (error) {
          console.log(error)
          toast.error("Search limit reached, try again later", toastOption);
        } finally {
          setIsSearching(false)
        }
    }

  return (
    <div className='flex items-center h-full aspect-square justify-center cursor-pointer bg-themeDark rounded-full z-10 '>
        {
          isSearching ? (
            <button title='Search by image' className='cursor-pointer '>
              <Loader />
            </button>
          )
          :
          (
            <button title='Search by image' onClick={()=>fileInputRef.current.click()} className='cursor-pointer '>
              <Camera color='white' width={16} />
            </button>
          )
        }
        <input accept='image/*' onChange={(e)=>handleImageUpload(e)} ref={fileInputRef} type='file' className='hidden' />
    </div>
  )
}

export default ImageSearch