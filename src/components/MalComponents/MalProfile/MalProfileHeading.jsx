import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import LoginButton from "../../MalLogin/LoginButton.jsx";
import http from "../../../http.js";
import useAuthStore from "../../../stores/AuthStore.js";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Droplet,
  Eye,
  LogOut,
  PauseCircle,
  TicketX,
  User,
} from "lucide-react";
import { useState } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick.js";
import { useNavigate } from "react-router-dom";
import useScrollPosition from "../../../stores/ScrollPositionStore.js";
import localforage from "localforage";

const MalProfileDropdown = () => {
  const ref = useRef(null);
  const authenticated = useAuthStore((s) => s.authenticated);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const setAuthData = useAuthStore((s) => s.setAuthData);

  const [open, setOpen] = useState(false);

  useOutsideClick(ref, () => {
    if (open) setOpen(false);
  });

  const loadCachedProfile = async () => {
    const cachedUser = await localforage.getItem("user_info");

    if (cachedUser) {
      setAuthData(cachedUser, true);
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ["malProfile"],
    queryFn: async () => {
      try {
        await loadCachedProfile();
        const { data } = await http.get("mal/me");
        setAuthData(data, true);
        localforage.setItem("user_info", data);
        return data;
      } catch (error) {
        setAuthData(null, false);
        localforage.removeItem("user_info");
        throw error;
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  if (isLoading && authenticated === null) {
    return null;
  }

  if (authenticated === null) {
    return null;
  }

  console.log(data);

  return (
    <div className="relative h-9 flex-1 flex flex-col">
      {authenticated === true ? (
        <div
          ref={ref}
          onClick={() => setOpen(!open)}
          className="relative flex gap-1 items-center cursor-pointer z-90"
        >
          <div className="w-9 h-9  hover:opacity-90 border border-gray-700 rounded-full overflow-hidden">
            <img className="" src={`https://robohash.org/${profile.name}`} />
          </div>
          <ChevronDown color="white" size={20} />

          {open && (
            <ProfileDropdown
              profile={profile}
              setOpen={setOpen}
              logout={logout}
            />
          )}
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

const ProfileDropdown = ({ profile, setOpen, logout }) => {
  const scrollPosition = useScrollPosition((s) => s.scrollPosition);
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition);
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: Eye,
      label: "Watching",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        navigate("/user/anime-list/watching");
      },
      className: "text-gray-400",
    },
    {
      icon: Clock,
      label: "Plan to Watch",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        navigate("/user/anime-list/plan_to_watch");
      },
      className: "text-gray-400",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        navigate("/user/anime-list/completed");
      },
      className: "text-gray-400",
    },
    {
      icon: PauseCircle,
      label: "On Hold",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        navigate("/user/anime-list/on_hold");
      },
      className: "text-gray-400",
    },
    {
      icon: TicketX,
      label: "Dropped",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        navigate("/user/anime-list/dropped");
      },
      className: "text-gray-400",
    },
    {
      icon: LogOut,
      label: "Logout",
      action: () => {
        setScrollPosition({ ...scrollPosition, userList: null });
        logout();
      },
      className: "text-red-500",
    },
  ];

  return (
    <main className="bg-themeDarker rounded-lg shadow-xl border border-themeDark absolute top-10 right-0 z-[999999999999999]">
      <header className="flex items-center px-4 py-3 gap-3 border-b border-themeDark cursor-default">
        <User className="w-5 h-5 text-slate-400" />
        <h3 className="font-medium whitespace-nowrap text-slate-200">
          {profile?.name}
        </h3>
      </header>
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => {
              item.action();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-themeDark transition-colors duration-150 text-left cursor-pointer"
          >
            <Icon className={`w-5 h-5 ${item.className}`} />
            <span
              className={`font-medium whitespace-nowrap text-sm ${item.className}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </main>
  );
};

export default MalProfileDropdown;
