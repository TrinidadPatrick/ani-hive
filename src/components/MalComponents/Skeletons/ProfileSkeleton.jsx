import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className="w-full rounded-xl bg-themeDarker p-6 animate-pulse">

      <div className="flex flex-col md:flex-row md:items-center gap-6">

        <div className="h-20 w-20 rounded-full bg-themeDark" />

        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 rounded bg-themeDark" />
          <div className="h-4 w-32 rounded bg-themeDark" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-[#171717] p-4 space-y-3"
          >
            <div className="h-5 w-12 rounded bg-themeDark" />
            <div className="h-4 w-24 rounded bg-themeDark" />
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default ProfileSkeleton