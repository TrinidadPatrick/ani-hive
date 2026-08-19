import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileNotFound = ({message}) => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-neutral-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-100 mb-3">
          Profile Not Found
        </h1>
        
        <p className="text-neutral-400 mb-8">
          The Profile you're looking for doesn't exist or is set to private.
        </p>
        
        <div className="space-y-3">
          
          <button onClick={()=>navigate('/')} className="w-full px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-300 font-medium rounded-lg transition-colors">
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileNotFound