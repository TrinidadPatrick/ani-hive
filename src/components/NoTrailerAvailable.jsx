import { Clock, Film } from 'lucide-react'
import React from 'react'

const NoTrailerAvailable = () => {
  return (
    <div className="w-full h-full bg-[#141414] flex items-center justify-center">
      <div className="w-full">
        <div className="bg-[#141414] rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex flex-col items-center text-center space-y-6">

            <div className="relative">
              <div className="absolute inset-0 bg-[#141414] blur-2xl rounded-full"></div>
              <div className="relative bg-[#141414] p-6 rounded-full border border-gray-700">
                <Film className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#141414]">
                No Trailer Available
              </h1>
              <p className="text-gray-400 text-lg">
                The anime trailer you're looking for isn't available at the moment.
              </p>
            </div>

            <div className="bg-[#141414] rounded-lg p-4 w-full">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Clock   className="w-5 h-5" />
                <span className="text-sm font-medium">Please try again later</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              Trailers are updated regularly. Check back soon for new content!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoTrailerAvailable