import ReactPlayer from "react-player"
import NoTrailerAvailable from "./NoTrailerAvailable"
import useSmallScreen from "../utils/useSmallScreen"


const TrailerPlayer = (props) => {
    const {youtubeId, setShowTrailer} = props
    const isSmallScreen = useSmallScreen()

    return (
        <main className='fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.9)]'>
                
                {
                    !youtubeId ? (
                        <>
                        <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-20 right-5 z-[99999999999999999]'>Close</button>
                        <NoTrailerAvailable />
                        </>
                    )
                    :
                    (
                    <>
                        {
                            isSmallScreen ? 
                            (
                                <div className='flex flex-col justify-center w-[100vw] h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-10 right-5 z-[99999999999999999]'>Close</button>
                                <ReactPlayer
                                            url={`https://www.youtube.com/watch?v=${youtubeId}&?vq=hd720`}
                                            width="100%"
                                            // height="100%"
                                            playing={true}
                                            muted={false}
                                            loop={true}
                                            controls={true}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className=' flex items-center justify-center w-[100vw] md:h-[100vh] aspect-video absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black'>
                                    <button onClick={()=>setShowTrailer(false)} className='absolute text-white top-5 right-7 cursor-pointer z-[99999999999999999]'>Close</button>
                                    <ReactPlayer
                                         url={`https://www.youtube.com/watch?v=${youtubeId}&?vq=hd720`}
                                        width="90%"
                                        height="90%"
                                        playing={false}
                                        muted={false}
                                        loop={true}
                                        controls={true}
                                        config={{
                                            youtube: {
                                            playerVars: {
                                                cc_load_policy: 1,
                                                cc_lang_pref: "en"
                                            }
                                            }
                                        }}
                                    />
                                </div>
                            )
                        }
                    </>
                    )
                }
        </main>
    )
    }

export default TrailerPlayer