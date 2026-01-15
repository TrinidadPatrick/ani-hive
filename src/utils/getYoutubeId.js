import React from 'react'

const getYoutubeId = (url) => {

    if(url)
    {
        const raw = url.split("?")[0].toString().split("/")
        const yt_id = raw[raw.length - 1]
        
        return yt_id ? yt_id : null
    }
    return null
    
}

export default getYoutubeId