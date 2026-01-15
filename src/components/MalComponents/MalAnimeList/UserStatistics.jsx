import React from 'react'
import useAuthStore from '../../../stores/AuthStore'
import { Calendar, CheckCircle, Clock, Pause, Play, Star, Tv, Tv2, XCircle } from 'lucide-react';
import { motion } from "framer-motion";
import ProfileSkeleton from '../Skeletons/ProfileSkeleton';

const UserStatistics = () => {
  const profile = useAuthStore((s) => s.profile)

  const stats = [
    { label: "Watching", value: 'num_items_watching', icon: <Play className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Completed", value: 'num_items_completed', icon: <CheckCircle className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Plan to Watch", value: 'num_items_plan_to_watch', icon: <Clock className="h-4 w-4" />, color: "text-pink-600" },
    { label: "On Hold", value: 'num_items_on_hold', icon: <Pause className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Dropped", value: 'num_items_dropped', icon: <XCircle className="h-4 w-4" />, color: "text-pink-600" },
  ];

  const personalStats = [
    { label: "Total Anime", value: 'num_items', icon: <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />, color: "text-pink-600" },
    { label: "Mean Score", value: 'mean_score', icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />, color: "text-pink-600" },
    { label: "Days Watched", value: 'num_days_watched', icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />, color: "text-pink-600" },
    { label: "Episodes", value: 'num_episodes', icon: <Tv2 className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />, color: "text-pink-600" },
  ];

  if(profile === null){
    return (
      <div className=' flex flex-col max-w-7xl xl:max-w-[90vw] mx-auto my-5'>
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className=" p-2 sm:p-4 md:space-y-5">

      <div className="bg-themeDarker rounded-xl py-4 border border-themeDark flex flex-col sm:flex-row items-center px-3 gap-5">
        {/* User Avatar */}
        <div className='w-30 aspect-square flex-none bg-red-100 rounded-full border-3 border-pink-600 overflow-hidden'>
          <img src={`https://robohash.org/${profile.name}`} />
        </div>
        {/* User statistics */}
        <div className='w-full flex flex-col'>
          {/* User name and date join */}
          <div className='w-full '>
            <h2 className='text-gray-100 text-4xl font-bold text-center sm:text-start'>{profile.name}</h2>
            <div className='flex justify-center sm:justify-start gap-2 text-gray-300'>
              <Calendar width={17} /> Joined {new Date(profile.joined_at).toLocaleDateString('US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          {/* User personal stat */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2'>
            {
              personalStats.map((item, index) => {
                return (
                  <div key={index} className='border border-themeDark p-3 rounded-lg bg-themeDark flex gap-3'>
                    <div className=' flex items-center'>
                      {item.icon}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-gray-100 font-bold text-lg leading-5'>{profile?.anime_statistics[item.value]}</span>
                      <span className='text-gray-400 text-xs sm:text-sm'>{item.label}</span>
                    </div>
                  </div>
                )
              })
            }

          </div>
        </div>
      </div>

      <div className="bg-themeDarker hidden rounded-xl py-4 border border-themeDark md:grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`${stat.color}`}>{stat.icon}</div>
            <span className="text-2xl font-bold font-display text-white">{profile?.anime_statistics[stat.value]}</span>
            <span className="text-xs text-muted-foreground text-gray-300">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default UserStatistics