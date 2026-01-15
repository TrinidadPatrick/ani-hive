import React from 'react'

const AnimeRelatedSkeleton = () => {
  return (
    <div>
        <div className="flex flex-rowl w-full mx-auto gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex gap-4 animate-pulse">

            <div className="w-28 h-40 bg-gray-700 rounded flex-shrink-0"></div>

            <div className="flex-1 py-2 space-y-3">

              <div className="hidden h-6 bg-gray-700 rounded w-3/4"></div>
              
              <div className="hidden h-4 bg-gray-700 rounded w-20"></div>
              
              <div className="hidden space-y-2 pt-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnimeRelatedSkeleton