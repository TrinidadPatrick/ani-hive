import React from 'react'

const Card = ({listType}) => {
      const isRow = listType === 'grid'

      return (
    <div className={`relative rounded-xl bg-themeDarker animate-pulse ${isRow ? 'flex gap-4 p-4' : 'flex flex-col overflow-hidden'}`}>

      <div className={`${isRow ? 'h-28 w-20 flex-shrink-0' : 'aspect-[3/4] w-full'} rounded-lg bg-themeDark`} />

      <div className={`${isRow ? 'flex flex-1 flex-col justify-between' : 'space-y-3 p-3 sm:p-4'}`}>

        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-themeDark" />
          <div className="h-4 w-1/3 rounded bg-themeDark" />
        </div>

        <div className={isRow ? 'mt-3' : ''}>
          <div className="h-2 w-full rounded-full bg-themeDark" />
          <div className="mt-2 h-3 w-16 rounded bg-themeDark" />
        </div>

        <div className={`${isRow ? 'mt-3' : ''} flex items-center gap-2`}>
          <div className="h-8 w-24 rounded-lg bg-themeDark" />
          <div className="h-8 w-8 rounded-lg bg-themeDark" />
        </div>
      </div>

      <div className={`h-7 w-10 rounded-full bg-themeDark ${isRow ? '' : 'absolute left-2 top-2'}`} />
    </div>
  );
}

const AnimeListSkeleton = ({listType = 'grid'}) => {
    return (
    <div className={`grid w-full mt-2 ${listType === 'grid' ? 'grid-cols-1 semiMd:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6' : 'grid-cols-1 xxs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 semiMd:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-4'}`}>
      {[...Array(6)].map((_, i) => (
        <Card key={i} listType={listType} />
      ))}
    </div>
  );
}

export default AnimeListSkeleton