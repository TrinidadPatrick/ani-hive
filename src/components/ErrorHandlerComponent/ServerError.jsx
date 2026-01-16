import React from 'react'

const ServerError = () => {
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-100 mb-3">
          Server Error
        </h1>
        
        <p className="text-neutral-400 mb-2">
          Something went wrong with the server.
        </p>
        
        <p className="text-neutral-500 text-sm mb-8">
          Please try again later or contact support if the problem persists.
        </p>
        
        <div className="space-y-3">
          <button onClick={()=>window.location.reload()} className="cursor-pointer w-full px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium rounded-lg transition-colors">
            Retry
          </button>
          
          <button onClick={()=>window.location.href = '/'} className="cursor-pointer w-full px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-300 font-medium rounded-lg transition-colors">
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServerError