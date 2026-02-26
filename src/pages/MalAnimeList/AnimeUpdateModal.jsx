import { motion } from "framer-motion";
import { ExternalLink, Minus, Plus, Save, Star, X } from "lucide-react";
import StatusDrodown from "./StatusDrodown";
import { useEffect, useState } from "react";
import useUserAnimeStore from "../../stores/UserAnimeStore.js";
import LoaderV2 from "../../components/LoaderV2.jsx";
import { useNavigate, useParams } from "react-router-dom";
import useScrollPosition from "../../stores/ScrollPositionStore.js";
import slugify from "slugify";

const AnimeUpdateModal = ({
  setIsOpen,
  score,
  setScore,
  selectedWatchStatus,
  setSelectedWatchStatus,
  anime,
  epStatus,
  setEpStatus,
  total_ep,
}) => {
  const scrollPosition = useScrollPosition((s) => s.scrollPosition);
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition);
  const navigate = useNavigate();
  const [hoveredScore, setHoveredScore] = useState(score);
  const [tempEpStatus, setTempEpStatus] = useState(epStatus);
  const { status } = useParams();
  const isUpdating = useUserAnimeStore((s) => s.isUpdating);
  const updateAnime = useUserAnimeStore((s) => s.updateAnime);
  const getList = useUserAnimeStore((s) => s.getList);
  const isDeleting = useUserAnimeStore((s) => s.isDeleting);
  const deleteAnime = useUserAnimeStore((s) => s.deleteAnime);

  const renderClickableStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <button
          onMouseEnter={() => setHoveredScore(i)}
          onMouseLeave={() => setHoveredScore(score)}
          key={i}
          onClick={() => setScore(i)}
          className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              hoveredScore >= i
                ? "fill-amber-400 text-amber-400"
                : "text-amber-400/40 hover:text-amber-400/60"
            }`}
          />
        </button>,
      );
    }
    return stars;
  };

  const handleUpdate = async () => {
    setTempEpStatus(epStatus);
    setIsOpen(false);
    const result = await updateAnime({
      id: anime.id,
      num_watched_episodes: epStatus,
      score: score,
      status: selectedWatchStatus,
    });
    if (result.status === 200) {
      getList(status);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = confirm(`Delete ${anime.title}?`, (e) =>
      console.log(e),
    );
    if (shouldDelete) {
      const result = await deleteAnime(anime.id);
      if (result.status === 200) {
        setIsOpen(false);
        getList(status);
      }
    }
  };

  const handleIncrement = () => {
    setEpStatus((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setEpStatus((prev) => prev - 1);
  };

  const handleSelect = (url) => {
    setScrollPosition({ ...scrollPosition, userList: window.pageYOffset });
    navigate(url);
  };

  useEffect(() => {
    if (epStatus === total_ep) {
      setSelectedWatchStatus("completed");
    } else if (epStatus >= 1) {
      setSelectedWatchStatus("watching");
    }
  }, [epStatus]);

  return (
    <main
      onClick={(e) => e.stopPropagation()}
      className="fixed w-[100svw] cursor-pointer h-[100dvh] top-0 left-0 z-[99999999999999999] pointer-none: bg-[rgba(0,0,0,0.7)]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
        className="bg-themeDark border border-themeLightDark p-4 w-xs sm:w-sm rounded-lg shadow-2xl absolute z-[99999999999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col">
          <div className="flex gap-2 items-start justify-between ">
            <h2 className="font-bold text-xl text-white text-start ">
              {anime.title}
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEpStatus(tempEpStatus);
                setIsOpen(false);
              }}
              className="text-white right-5 cursor-pointer hover:text-gray-300 self-start bg-themeDark min-w-7 min-h-7 flex justify-center items-center rounded-full"
            >
              <X width={17} />
            </button>
          </div>

          <button
            onClick={() =>
              handleSelect(
                `/anime/${anime.id}?title=${slugify(anime?.title || "")}`,
              )
            }
            className="cursor-pointer hover:bg-themeDarker hover:text-blue-400 group flex items-center justify-center gap-2 w-full py-2 bg-themeDarkest border-2 mt-2 border-themeLightDark text-white rounded-lg"
          >
            <ExternalLink width={17} />
            <span className="text-sm ">View Anime Info</span>
          </button>

          <div className="flex flex-col gap-2 mt-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100">
                Score: <span className="text-pink-600 font-bold">{score}</span>
              </label>
              <div className="flex items-center gap-0.5">
                {renderClickableStars()}
              </div>
            </div>
          </div>

          {/* Watch status */}
          <div className="mt-7 space-y-2 flex flex-col">
            <label className="text-sm font-medium text-gray-100">Status</label>
            <div className="h-10">
              <StatusDrodown
                selectedWatchStatus={selectedWatchStatus}
                s
                setSelectedWatchStatus={setSelectedWatchStatus}
                anime={anime}
                buttonClassname="bg-themeDarker border border-themeLightDark h-full px-3 flex items-center justify-between rounded-lg relative gap-2 cursor-pointer hover:bg-themeDark"
                titleClassname="text-gray-100 text-base"
                arrowClassname="text-gray-100"
                dropdownClassname="bg-themeDark"
                textClassname="text-gray-200 text-sm"
                dropdownButtonClassname="hover:bg-themeDarker"
                arrowSize={20}
              />
            </div>
          </div>

          {/* episode status */}
          <div className="space-y-2 mt-7">
            <label className="text-sm font-medium text-gray-100">
              Episodes Watched
            </label>
            <div className="flex items-center gap-3 mt-1">
              <button
                disabled={epStatus === 0}
                onClick={handleDecrement}
                className="text-white bg-themeDarker border border-themeLightDark rounded-full w-7 h-7 flex justify-center items-center cursor-pointer"
              >
                <Minus width={17} />
              </button>
              <input
                type="range"
                min={0}
                max={total_ep}
                value={epStatus}
                onChange={(e) => setEpStatus(Number(e.target.value))}
                className="flex-1 accent-pink-600"
              />
              <button
                disabled={epStatus === total_ep}
                onClick={handleIncrement}
                className="text-white bg-themeDarker border border-themeLightDark rounded-full w-7 h-7 flex justify-center items-center cursor-pointer"
              >
                <Plus width={17} />
              </button>
              <span className="text-sm font-bold text-gray-100 min-w-[60px] text-right">
                {epStatus} / {total_ep}
              </span>
            </div>
          </div>

          {/* Submit & delete */}
          <div className="w-full flex justify-between mt-7 gap-2">
            <button
              onClick={handleDelete}
              title="update"
              className="bg-red-500 hover:bg-red-400 cursor-pointer w-20 justify-center rounded h-8 flex items-center gap-2 text-gray-100"
            >
              {isDeleting ? (
                <LoaderV2 width={6} height={6} color={"bg-white"} />
              ) : (
                "Delete"
              )}
            </button>
            <button
              onClick={handleUpdate}
              title="update"
              className="bg-pink-600 hover:bg-pink-500 cursor-pointer w-full justify-center rounded h-8 flex items-center gap-2 text-gray-100"
            >
              {isUpdating ? (
                <LoaderV2 width={6} height={6} color={"bg-white"} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default AnimeUpdateModal;
