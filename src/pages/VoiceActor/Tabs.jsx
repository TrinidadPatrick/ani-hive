import { BookOpen, Film, Mic } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useScrollPosition from "../../stores/ScrollPositionStore";
import { AnimatePresence, motion } from "framer-motion";
import slugify from "slugify";

const Tabs = ({ personInfo }) => {
  const scrollPosition = useScrollPosition((s) => s.scrollPosition);
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(searchParams.get("tab") || 0);
  const [displayLimit, setDisplayLimit] = useState(
    scrollPosition?.voiceActor ? 100000 : 50,
  );
  const tabItems = [
    {
      label: "Anime",
      value: "anime",
      icon: Film,
      data: personInfo.anime,
      char_mal_id: (item) => item?.character?.mal_id,
      mal_id: (item) => item?.anime?.mal_id,
      title: (item) => item?.anime?.title,
      subtitle: (item) => item?.position,
      image: (item) => item?.anime?.images?.jpg?.image_url,
    },
    {
      label: "Voice Roles",
      value: "voices",
      icon: Mic,
      data: personInfo.voices,
      char_mal_id: (item) => item?.character.mal_id,
      mal_id: (item) => item?.anime?.mal_id,
      title: (item) => item?.anime?.title,
      subtitle: (item) => item?.role,
      image: (item) => item?.anime?.images?.jpg?.image_url,
    },
    {
      label: "Manga",
      value: "manga",
      icon: BookOpen,
      data: personInfo.manga,
      char_mal_id: (item) => item?.character?.mal_id,
      mal_id: (item) => item?.manga?.mal_id,
      title: (item) => item?.manga?.title,
      subtitle: (item) => item?.position,
      image: (item) => item?.manga?.images?.jpg?.image_url,
    },
  ];

  const handleClick = useCallback(
    (index) => {
      setDisplayLimit(20);
      setSearchParams({ tab: index }, { preventScrollReset: true });
      setSelectedTab(index);
    },
    [setSearchParams, setSelectedTab],
  );

  const RenderTabs = React.memo(({ tabItem, active, handleClick, index }) => {
    return (
      <button
        onClick={() => handleClick(index)}
        className={`cursor-pointer flex gap-2 flex-1 justify-center py-1 rounded-lg ${active ? "bg-themeDarker text-white" : "text-gray-200"}`}
      >
        <tabItem.icon width={16} />
        <span className="text-xs sm:text-base mt-1 sm:mt-0">
          {tabItem.label}
        </span>
      </button>
    );
  });

  const RenderItems = React.memo(
    ({ char_mal_id, mal_id, title, subtitle, image }) => {
      return (
        <div
          onClick={() => {
            setScrollPosition({
              ...scrollPosition,
              voiceActor: window.pageYOffset,
            });
            navigate(
              `/anime/${mal_id}?title=${slugify(title)}&va=${char_mal_id || 0}`,
            );
          }}
          className="flex gap-2 cursor-pointer hover:bg-themeDarker rounded-lg"
        >
          <div className="min-w-20 max-w-20 aspect-[3/4]">
            <img src={image} className="rounded w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-gray-100 font-medium text-base lg:text-lg line-clamp-3">
              {title}
            </h2>
            <h3 className="text-gray-300 text-xs">{subtitle}</h3>
          </div>
        </div>
      );
    },
  );

  useEffect(() => {
    if (scrollPosition?.voiceActor) {
      window.scroll({
        top: scrollPosition.voiceActor,
        behavior: "smooth",
      });
      setScrollPosition({ ...scrollPosition, voiceActor: null });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayLimit >= tabItems[selectedTab].data.length) {
        return clearInterval(interval);
      }
      setDisplayLimit((prev) => prev + 50);
    }, 1000);

    return () => clearInterval(interval);
  }, [displayLimit]);

  return (
    <main className="w-full flex flex-col gap-3">
      <nav className="w-full flex gap-1 sm:gap-2 justify-evenly bg-themeDark p-1 rounded-lg">
        {tabItems.map((tabItem, index) => {
          return (
            <RenderTabs
              handleClick={handleClick}
              index={index}
              active={selectedTab == index}
              key={index}
              tabItem={tabItem}
            />
          );
        })}
      </nav>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {tabItems[selectedTab].data
            .slice(0, displayLimit)
            .map((item, index) => {
              const itemId = tabItems[selectedTab].mal_id(item);
              const itemKey = `${selectedTab}-${itemId}-${index}`;
              return (
                <motion.div
                  key={itemKey}
                  layout="position"
                  className=""
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                >
                  <RenderItems
                    key={index}
                    char_mal_id={tabItems[selectedTab].char_mal_id(item)}
                    mal_id={tabItems[selectedTab].mal_id(item)}
                    title={tabItems[selectedTab].title(item)}
                    subtitle={tabItems[selectedTab].subtitle(item)}
                    image={tabItems[selectedTab].image(item)}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Tabs;
