import React from 'react'

const AnimeReviewsSkeleton = () => {
  return (
    <div>
      <div className="w-full mx-auto space-y-6">
        {[1, 2].map((item) => (
          <div key={item} className="animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gray-700 rounded"></div>
              
              {/* Username and badges */}
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-700 rounded w-32"></div>
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-700 rounded w-28"></div>
                  <div className="h-5 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              
              {/* Date */}
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
            
            {/* Review text */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
            
            {/* See more button */}
            <div className="h-4 bg-gray-700 rounded w-20 mb-4"></div>
            
            {/* Reaction buttons */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((btn) => (
                <div key={btn} className="h-9 bg-gray-700 rounded w-28"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnimeReviewsSkeleton