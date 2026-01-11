import React from 'react'
import useAuthStore from '../../../stores/AuthStore'
import { CheckCircle, Clock, Pause, Play, Tv, XCircle } from 'lucide-react';
import { motion } from "framer-motion";

const UserStatistics = () => {
    const profile = useAuthStore((s) => s.profile)

    const stats = [
    { label: "Watching", value: 'num_items_watching', icon: <Play className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Completed", value: 'num_items_completed', icon: <CheckCircle className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Plan to Watch", value: 'num_items_plan_to_watch', icon: <Clock className="h-4 w-4" />, color: "text-pink-600" },
    { label: "On Hold", value: 'num_items_on_hold', icon: <Pause className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Dropped", value: 'num_items_dropped', icon: <XCircle className="h-4 w-4" />, color: "text-pink-600" },
    { label: "Total Entries", value: 'num_items', icon: <Tv className="h-4 w-4" />, color: "text-pink-600" },
  ];
  return (
    <div className="p-4">
      <div className="bg-themeDarker rounded-xl py-4 border border-themeDark grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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