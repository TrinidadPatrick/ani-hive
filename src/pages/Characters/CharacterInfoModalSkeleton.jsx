import React from 'react'

const CharacterInfoModalSkeleton = () => {
  return (
    <div className="bg-themeDarkest text-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-end mb-4">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-48 h-64 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex gap-6 mb-6 border-b border-gray-700 pb-2">
          <div className="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="h-8 w-32 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-28 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        <div className="mb-6">
          <div className="h-5 w-full max-w-xl bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="mt-6">
          <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default CharacterInfoModalSkeleton