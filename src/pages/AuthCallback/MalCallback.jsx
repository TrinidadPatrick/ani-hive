import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import http from '../../http'

const MalCallback = () => {
    const [searchParams, setSeachParams] = useSearchParams()
    const hasLoggedIn = useRef(false)

    const handleCallback = async () => {
        const return_url = searchParams.get("state")
        const code = searchParams.get("code")
        const code_verifier = localStorage.getItem("code_verifier")

        if(code && code_verifier){
            if(!hasLoggedIn.current){
              hasLoggedIn.current = true;
              try {
                  const result = await http.post("auth/mal/token", {code, codeVerifier : code_verifier}, {
                      withCredentials: true
                  })
              } catch (error) {
                  console.log(error)
              } finally {
                  localStorage.removeItem("code_verifier")
                  window.location.href = return_url || '/'
              }
            }
        }else{
            window.location.href = return_url || '/'
        }
    }

    useEffect(()=>{
        handleCallback()
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F1A] px-4">
      <div className="max-w-md w-full text-center space-y-10">
        
        <div className="relative flex justify-center items-center">

          <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full animate-pulse blur-xl"></div>
          
          <div className="absolute w-24 h-24 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
          
          <div className="relative z-10 w-20 h-20 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-700/50">
            <div className="flex items-end space-x-1.5 h-10">
              <div className="w-2 bg-pink-600 rounded-full animate-[bounce_1.2s_infinite_100ms] shadow-[0_0_10px_rgba(37,99,235,0.5)] h-8"></div>
              <div className="w-2 bg-pink-500 rounded-full animate-[bounce_1.2s_infinite_200ms] shadow-[0_0_15px_rgba(96,165,250,0.5)] h-10"></div>
              <div className="w-2 bg-pink-400 rounded-full animate-[bounce_1.2s_infinite_300ms] shadow-[0_0_10px_rgba(34,211,238,0.5)] h-8"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Authenticating with <span className="text-pink-400">MAL</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
            VALIDATING USER CREDENTIALS...
          </p>
        </div>

        <div className="relative w-56 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent w-full animate-[loading_2s_infinite] -translate-x-full"></div>
        </div>

        <div className="pt-4 flex items-center justify-center space-x-2">
          <div className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full flex items-center space-x-2">
            <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              Verified OAuth 2.0
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
    )
}

export default MalCallback