import React from 'react'

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h2 className="text-8xl font-bold text-neutral-800 mb-2">404</h2>
          <svg
            className="mx-auto h-16 w-16 text-neutral-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-100 mb-3">
          Page Not Found
        </h1>
        
        <p className="text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <button onClick={()=>window.location.href = '/'} className="cursor-pointer w-full px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium rounded-lg transition-colors">
            Go Home
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default PageNotFound