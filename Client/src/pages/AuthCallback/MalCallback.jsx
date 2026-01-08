import axios from 'axios'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import http from '../../http'

const MalCallback = () => {
    const [searchParams, setSeachParams] = useSearchParams()

    const handleCallback = async () => {
        const code = searchParams.get("code")
        const code_verifier = localStorage.getItem("code_verifier")

        if(code && code_verifier){
            try {
                const result = await http.post("auth/mal/token", {code, codeVerifier : code_verifier}, {
                    withCredentials: true
                })
                console.log(result.data)
            } catch (error) {
                console.log(error)
            } finally {
                window.location.href = '/'
            }
        }
    }

    useEffect(()=>{
        handleCallback()
    }, [])
}

export default MalCallback