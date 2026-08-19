import React from "react";
import useAuthStore from "../../stores/AuthStore";
import {
  Calendar,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Star,
  Tv,
  Tv2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileSkeleton from "../../components/MalComponents/Skeletons/ProfileSkeleton";

const UserStatistics = ({ status }) => {
  const profile = useAuthStore((s) => s.profile);

  const shareUserProfile = async (username) => {
    const profileUrl = `${window.location.origin}/user-list/${profile.name}/${status}`;

    const shareData = {
      title: `${profile.name}'s Anime Profile`,
      text: `Check out ${profile.name}'s anime list and stats!`,
      url: profileUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return { success: true, method: "share" };
      }

      await navigator.clipboard.writeText(profileUrl);
      return { success: true, method: "clipboard" };
    } catch (err) {
      if (err.name === "AbortError") {
        return { success: false, reason: "cancelled" };
      }

      console.error("Failed to share profile:", err);

      try {
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return { success: true, method: "clipboard" };
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        return { success: false, reason: "error", error: err };
      }
    }
  };

  const stats = [
    {
      label: "Watching",
      value: "num_items_watching",
      icon: <Play className="h-4 w-4" />,
      color: "text-pink-600",
    },
    {
      label: "Completed",
      value: "num_items_completed",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-pink-600",
    },
    {
      label: "Plan to Watch",
      value: "num_items_plan_to_watch",
      icon: <Clock className="h-4 w-4" />,
      color: "text-pink-600",
    },
    {
      label: "On Hold",
      value: "num_items_on_hold",
      icon: <Pause className="h-4 w-4" />,
      color: "text-pink-600",
    },
    {
      label: "Dropped",
      value: "num_items_dropped",
      icon: <XCircle className="h-4 w-4" />,
      color: "text-pink-600",
    },
  ];

  const personalStats = [
    {
      label: "Total Anime",
      value: "num_items",
      icon: <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />,
      color: "text-pink-600",
    },
    {
      label: "Mean Score",
      value: "mean_score",
      icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />,
      color: "text-pink-600",
    },
    {
      label: "Days Watched",
      value: "num_days_watched",
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />,
      color: "text-pink-600",
    },
    {
      label: "Episodes",
      value: "num_episodes",
      icon: <Tv2 className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />,
      color: "text-pink-600",
    },
  ];

  if (profile === null) {
    return (
      <div className=" flex flex-col max-w-7xl xl:max-w-[90vw] mx-auto my-5">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className=" p-2 sm:p-4 md:space-y-5">
      <div className="bg-themeDarker rounded-xl py-4 border border-themeDark flex flex-col sm:flex-row items-center px-3 gap-5">
        {/* User Avatar */}
        <div className="w-30 aspect-square flex-none bg-red-100 rounded-full border-3 border-pink-600 overflow-hidden">
          <img src={`https://robohash.org/${profile.name}`} />
        </div>
        {/* User statistics */}
        <div className="w-full flex flex-col">
          {/* User name and date join */}
          <div className="w-full">
            {/* Flex container to hold the name and share button */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="text-gray-100 text-4xl font-bold text-center sm:text-start">
                {profile.name}
              </h2>

              {/* Share Button */}
              <button
                onClick={shareUserProfile}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg transition-colors shrink-0"
                title="Share Profile"
              >
                {/* Share Icon */}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Joined Date */}
            <div className="flex justify-center sm:justify-start items-center gap-2 text-gray-300 mt-1">
              <Calendar width={17} /> Joined{" "}
              {new Date(profile.joined_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          {/* User personal stat */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {personalStats.map((item, index) => {
              return (
                <div
                  key={index}
                  className="border border-themeDark p-3 rounded-lg bg-themeDark flex gap-3"
                >
                  <div className=" flex items-center">{item.icon}</div>
                  <div className="flex flex-col">
                    <span className="text-gray-100 font-bold text-lg leading-5">
                      {profile?.anime_statistics[item.value]}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
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
            <span className="text-2xl font-bold font-display text-white">
              {profile?.anime_statistics[stat.value]}
            </span>
            <span className="text-xs text-muted-foreground text-gray-300">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserStatistics;
