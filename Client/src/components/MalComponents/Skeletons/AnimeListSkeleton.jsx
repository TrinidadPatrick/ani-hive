import React from 'react'

const Card = () => {
      return (
    <div className="flex gap-4 rounded-xl bg-themeDarker p-4 animate-pulse">

      <div className="h-28 w-20 flex-shrink-0 rounded-lg bg-themeDark" />

      <div className="flex flex-1 flex-col justify-between">

        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-themeDark" />
          <div className="h-4 w-1/3 rounded bg-themeDark" />
        </div>

        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-themeDark" />
          <div className="mt-2 h-3 w-16 rounded bg-themeDark" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg bg-themeDark" />
          <div className="h-8 w-8 rounded-lg bg-themeDark" />
        </div>
      </div>

      <div className="h-7 w-10 rounded-full bg-themeDark" />
    </div>
  );
}

const AnimeListSkeleton = () => {
    return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {[...Array(6)].map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}

export default AnimeListSkeleton