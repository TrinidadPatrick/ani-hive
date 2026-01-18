import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TopSection from "./TopSection"
import About from "./About"
import Tabs from "./Tabs"

const VoiceActorDetails = () => {
    const [personInfo, setPersonInfo] = useState(null)
    const {id} = useParams()
    
    const getPersonInfo = async () => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/people/${id}/full`)
            const {data} = response.data
            if(data){
                setPersonInfo(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPersonInfo()
    },[])

    if(!personInfo) return null

    return (
        <main className="w-full min-h-screen pt-20 bg-themeExtraDarkBlue flex flex-col gap-10">
            {/* Top Section */}
            <section className="border-b-0 border-amber-50 flex px-3 sm:px-20 pt-5">
                <TopSection personInfo={personInfo} />
            </section>
            {/* About Section */}
            <section className=" border-b-0 border-amber-50 flex px-3 sm:px-20">
                <About personInfo={personInfo} />
            </section>
            {/* Tabs section */}
            <section className=" border-b-0 border-amber-50 flex px-3 sm:px-20">
                <Tabs personInfo={personInfo} />
            </section>
        </main>
    )
}

export default VoiceActorDetails