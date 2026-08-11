import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import slugify from "slugify";
import Select from "react-select";
import Footer from "../Home/Footer";
import useExploreAnimeList from "../../stores/ExploreAnimeListStore";
import ExploreNavbar from "./ExploreNavbar";
import useScrollPosition from "../../stores/ScrollPositionStore";
import { Star } from "lucide-react";

const Explore = () => {
  const navigate = useNavigate();
  const otherRefs = useRef([]);
  const scrollPosition = useScrollPosition((s) => s.scrollPosition);
  const setScrollPosition = useScrollPosition((s) => s.setScrollPosition);
  const animeList = useExploreAnimeList((s) => s.animeList);
  const setAnimeList = useExploreAnimeList((s) => s.setAnimeList);
  const [hovered, setHovered] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState([]);
  const [themes, setThemes] = useState([]);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get("genres")?.split(",").map(Number) || [],
  );
  const [selectedSortItem, setSelectedSortItem] = useState({
    order_by: searchParams.get("order_by") || "",
    sort_by: searchParams.get("sort_by") || "desc",
  });
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "",
  );
  const [selectedSeason, setSelectedSeason] = useState(
    searchParams.get("season") || "",
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year") || "",
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "",
  );
  const [showState, setShowState] = useState("");
  const [showOtherFilter, setShowOtherFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // const [animeList, setAnimeList] = useState(null)
  const [pageInfo, setPageInfo] = useState(null);
  const [pageList, setPageList] = useState([]);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const status = ["Airing", "Complete", "Upcoming", "Unknown"];
  const otherFilters = [
    {
      name: "Year",
      options: Array.from({ length: 100 }, (_, i) => i + 2000),
    },
    {
      name: "Season",
      options: ["Spring", "Summer", "Fall", "Winter", "Unknown"],
    },
    {
      name: "Type",
      options: ["TV", "OVA", "Movie", "Special", "ONA", "Music"],
    },
  ];

  const sortItems = [
    { key: "Title", value: "title" },
    { key: "Start Date", value: "start_date" },
    { key: "End Date", value: "end_date" },
    { key: "Score", value: "score" },
    { key: "Rank", value: "rank" },
    { key: "Popularity", value: "popularity" },
  ];
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGenres = async (retries = 10) => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_PRIMARY_URL}/genres/anime`,
      );
      if (result.status === 200) {
        const genres = result.data.data;
        const themes = [...genres];
        themes.splice(0, 22);
        setThemes(themes);
        setGenres(genres);
      }
    } catch (error) {
      console.log(error);
      if (retries > 0) {
        setTimeout(() => {
          getGenres(1, retries - 1);
        }, 1000);
      }
    }
  };

  const handleSearch = async (
    searchValue,
    selectedGenres,
    selectedStatus,
    selectedSeason,
    selectedYear,
    selectedType,
    selectedOrderBy,
    selectedSortBy,
    pageNum,
    retries = 10,
  ) => {
    const params = {};

    const seasonDates = {
      winter: {
        start: `${selectedYear}-01-01`,
        end: `${selectedYear}-03-31`,
      },
      spring: {
        start: `${selectedYear}-04-01`,
        end: `${selectedYear}-06-30`,
      },
      summer: {
        start: `${selectedYear}-07-01`,
        end: `${selectedYear}-09-30`,
      },
      fall: {
        start: `${selectedYear}-10-01`,
        end: `${selectedYear}-12-31`,
      },
    };

    const season = selectedSeason
      ? seasonDates[selectedSeason.toLowerCase()]
      : null;

    // Search params for frontend state
    if (searchValue) params.q = searchValue;
    if (selectedGenres?.length > 0) {
      params.genres = selectedGenres.join(",");
    }
    if (selectedStatus) params.status = selectedStatus;
    if (selectedSeason) params.season = selectedSeason;
    if (selectedYear) params.year = selectedYear;
    if (selectedType) params.type = selectedType;
    if (pageNum) params.page = pageNum;

    if (selectedOrderBy && selectedSortBy) {
      params.order_by = selectedOrderBy;
      params.sort_by = selectedSortBy;
    }

    setSearchParams(params);

    // API query parameters
    const queryParams = new URLSearchParams();

    if (searchValue) {
      queryParams.set("q", searchValue);
    }

    if (selectedGenres?.length > 0) {
      queryParams.set("genres", selectedGenres.join(","));
    }

    if (selectedStatus) {
      queryParams.set("status", selectedStatus);
    }

    if (selectedSeason && selectedYear && season) {
      queryParams.set("start_date", season.start);
      queryParams.set("end_date", season.end);
    } else if (selectedYear) {
      queryParams.set("start_date", `${selectedYear}-01-01`);
      queryParams.set("end_date", `${selectedYear}-12-31`);
    }

    if (selectedType) {
      queryParams.set("type", selectedType);
    }

    queryParams.set("sfw", "true");

    if (pageNum) {
      queryParams.set("page", String(Number(pageNum)));
    }

    if (selectedOrderBy && selectedSortBy) {
      queryParams.set("sort", selectedSortBy);
      queryParams.set("order_by", selectedOrderBy);
    }

    queryParams.set("unapproved", "false");
    queryParams.set("min_score", "1");

    const url = `${import.meta.env.VITE_PRIMARY_URL}/anime?${queryParams.toString()}`;

    try {
      const result = await axios.get(url);

      setAnimeList(result.data.data);
      setPageInfo(result.data.pagination);
      setPage(result.data.pagination.current_page);
      setSearching(false);
    } catch (error) {
      console.log(error);

      if (retries > 0) {
        setTimeout(() => {
          handleSearch(
            searchValue,
            selectedGenres,
            selectedStatus,
            selectedSeason,
            selectedYear,
            selectedType,
            selectedOrderBy,
            selectedSortBy,
            1,
            retries - 1,
          );
        }, 1000);
      }
    }
  };

  const handlePaginate = (pageNum) => {
    setPage(pageNum);
    setScrollPosition({ ...scrollPosition, explore: null });
    handleSearch(
      searchValue,
      selectedGenres,
      selectedStatus,
      selectedSeason,
      selectedYear,
      selectedType,
      selectedSortItem.order_by,
      selectedSortItem.sort_by,
      pageNum,
    );
  };

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    setSearching(scrollPosition?.explore == null ? true : false);
    handleSearch(
      searchValue,
      selectedGenres,
      selectedStatus,
      selectedSeason,
      selectedYear,
      selectedType,
      selectedSortItem.order_by,
      selectedSortItem.sort_by,
      page,
    );
  }, []);

  useEffect(() => {
    if (pageInfo) {
      if (page <= 0 || page > pageInfo?.last_visible_page) {
        window.location.href = `/explore?page=1`;
      }

      const total_pages = pageInfo?.last_visible_page;

      // Check if current page is in the last 8 pages
      const isLastEightPages = pageInfo?.current_page > total_pages - 7;

      // Determine the starting page for the list
      const startPage =
        pageInfo?.current_page === 1 ? 1 : pageInfo?.current_page - 1;

      // If last 8 pages, generate from the end, otherwise generate normally
      const temp = Array.from(
        { length: screenWidth < 600 ? 5 : 8 },
        (_, index) => total_pages - 7 + index,
      );

      // Final page list
      const pageLists =
        total_pages > 8
          ? isLastEightPages
            ? temp
            : Array.from(
                { length: screenWidth < 600 ? 4 : 8 },
                (_, index) => index + startPage,
              )
          : Array.from({ length: total_pages }, (_, index) => index + 1);

      setPageList(pageLists);
    }
  }, [pageInfo, screenWidth]);

  useEffect(() => {
    if (scrollPosition?.explore && animeList !== null) {
      window.scrollTo(0, scrollPosition.explore);
    }
  }, [animeList]);

  return (
    <main
      onClick={() => {
        setShowState(false);
        setShowSort(false);
        setShowOtherFilter(false);
      }}
      className="w-full min-h-dvh bg-themeExtraDarkBlue flex flex-col gap-5 items-center pt-20"
    >
      <div className="flex flex-col items-start gap-0  w-[95%] lg:w-[90%] mx-auto">
        <h1 className="text-white text-start text-3xl font-semibold">
          Explore
        </h1>
        <p className="text-gray-400 text-start text-sm">
          Find anime that matches your preferences
        </p>
      </div>
      <ExploreNavbar
        searchValue={searchValue}
        selectedGenres={selectedGenres}
        selectedSeason={selectedSeason}
        selectedYear={selectedYear}
        selectedType={selectedType}
        selectedSortItem={selectedSortItem}
        genres={genres}
        themes={themes}
        selectedStatus={selectedStatus}
        status={status}
        showSort={showSort}
        showOtherFilter={showOtherFilter}
        showState={showState}
        otherFilters={otherFilters}
        sortItems={sortItems}
        setShowSort={setShowSort}
        setSelectedStatus={setSelectedStatus}
        setSelectedSeason={setSelectedSeason}
        setSelectedYear={setSelectedYear}
        setSelectedType={setSelectedType}
        setSelectedGenres={setSelectedGenres}
        setSearchValue={setSearchValue}
        setSelectedSortItem={setSelectedSortItem}
        setShowOtherFilter={setShowOtherFilter}
        setSearching={setSearching}
        setShowState={setShowState}
        handleSearch={handleSearch}
        otherRefs={otherRefs}
      />

      {/* List */}
      <div className="w-[90%] relative mx-auto h-fit gap-5 z-9 grid py-5 grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {/* Results and clear filter for mobile */}
        <div className="absolute right-0 -top-1 flex w-full justify-end">
          <p className=" text-gray-200 text-sm">
            Results: {pageInfo?.items?.total}
          </p>
        </div>
        {searching ? (
          Array.from(
            { length: 20 },
            (_, index) => index + pageInfo?.current_page,
          ).map((page, index) => {
            return (
              <div
                key={index}
                className="w-[140px] sm:w-[160px] md:w-[180px] animate-pulse"
              >
                <div className="relative w-full h-[210px] sm:h-[230px] md:h-[260px] bg-gray-700 rounded-md"></div>
                <div className="mt-2 h-4 w-3/4 bg-gray-600 rounded"></div>
                <div className="mt-1 h-4 w-1/2 bg-gray-600 rounded"></div>
              </div>
            );
          })
        ) : !searching && animeList?.length > 0 ? (
          animeList?.length > 0 &&
          animeList.map((anime, index, array) => {
            if (array[index - 1]?.mal_id != anime?.mal_id) {
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => {
                    setScrollPosition({
                      ...scrollPosition,
                      explore: window.pageYOffset,
                    });
                    navigate(
                      `/anime/${anime?.mal_id}?title=${slugify(anime.title)}`,
                    );
                  }}
                  className="w-full h-fit rounded-lg group bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center"
                >
                  {/* Image Container */}
                  <div className="rounded-lg overflow-hidden relative border border-gray-800">
                    <img
                      src={anime?.images?.webp?.image_url}
                      alt={anime?.title_english || anime?.title}
                      className=" w-full h-full hover:scale-105 object-cover rounded-lg aspect-[2/3]"
                    />

                    <div
                      className={`absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
                        hovered === index ? "opacity-100" : "opacity-90"
                      }`}
                    />

                    {/* Year and status */}
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-4 sm:p-3 text-white">
                      <div
                        className={`transition-all duration-300 ${
                          hovered === index
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-90"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-gray-300 jakarta">
                          <span className="text-xs">
                            {anime?.year || "TBA"}{" "}
                            <span className="text-pink-600 text-xl"> • </span>
                            {anime?.status || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {anime?.score && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <Star
                        className="fill-amber-500 text-amber-500"
                        width={13}
                      />
                      {anime?.score}
                    </div>
                  )}

                  {/* Info */}
                  <div className="w-full bottom-0 bg-transparent rounded-b-lg flex h-full text-white mt-3">
                    <div className="flex flex-col items-start w-full h-full justify-between b">
                      <h3 className="text-white font-medium text-start text-sm md:text-[0.9rem] w-full leading-5 line-clamp-2 overflow-hidden max-h-5 group-hover:max-h-10 transition-[max-height] duration-300 ease-out">
                              {anime?.title?.english || anime?.title?.romaji}
                        {anime?.title_english?.replace(/;/g, " ") ||
                          anime?.title?.replace(/;/g, " ")}
                      </h3>
                      <div className=" z-[999] w-full ">
                        <span className="text-xs text-white/50 font-light jakarta">
                          {anime?.genres
                            ?.slice(0, 2)
                            .map((genre) => genre.name)
                            .join(" • ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })
        ) : !searching && animeList?.length == 0 ? (
          <div className="w-[90vw] h-[50svh] mx-auto  rounded-lg flex flex-col justify-center items-center">
            <h1 className="text-white text-2xl font-bold">No results</h1>
            <p className="text-gray-400 text-sm">
              Try searching with different keywords
            </p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      <div className="w-full flex gap-3 justify-center">
        {page !== 1 && (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleSearch(
                searchValue,
                selectedGenres,
                selectedStatus,
                selectedSeason,
                selectedYear,
                selectedType,
                selectedSortItem.order_by,
                selectedSortItem.sort_by,
                page - 9 <= 0 ? 1 : page - 9,
              );
            }}
            className="text-white font-medium text-[0.7rem] sm:text-xs md:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-[#4a4a4a39] md:hover:bg-pink-500 rounded cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.29 17.29a.996.996 0 0 0 0-1.41L14.42 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L12.3 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"
              />
              <path
                fill="currentColor"
                d="M11.7 17.29a.996.996 0 0 0 0-1.41L7.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L5.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"
              />
            </svg>
          </button>
        )}

        {pageList.length > 0 &&
          pageList.map((pageNum, index) =>
            pageNum <= pageInfo?.last_visible_page ? (
              <button
                key={index}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  handlePaginate(pageNum);
                }}
                className={`text-white text-[0.7rem] sm:text-xs md:text-sm font-medium px-4 sm:px-3 py-1 sm:py-2 ${
                  pageNum === page ? "bg-pink-500" : "bg-[#4a4a4a39]"
                } md:hover:bg-pink-500 rounded cursor-pointer`}
              >
                {pageNum}
              </button>
            ) : null,
          )}

        {!pageList.includes(Number(pageInfo?.last_visible_page)) && (
          <>
            {/* <button className="text-white font-medium px-2 sm:px-3 py-1 sm:py-2 rounded cursor-default">
              ...
            </button> */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                handlePaginate(pageInfo?.last_visible_page);
              }}
              className={`text-white text-[0.7rem] sm:text-xs md:text-sm font-medium px-2 sm:px-3 py-1 sm:py-2 ${
                pageInfo?.last_visible_page === page
                  ? "bg-pink-500"
                  : "bg-[#4a4a4a39]"
              } md:hover:bg-pink-500 rounded cursor-pointer`}
            >
              {pageInfo?.last_visible_page}
            </button>
          </>
        )}

        {page !== pageInfo?.last_visible_page && (
          <button
            onClick={() =>
              handleSearch(
                searchValue,
                selectedGenres,
                selectedStatus,
                selectedSeason,
                selectedYear,
                selectedType,
                selectedSortItem.order_by,
                selectedSortItem.sort_by,
                page + 9,
              )
            }
            className="text-white font-medium px-3 py-2 rotate-180 bg-[#4a4a4a39] md:hover:bg-pink-500 rounded cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.29 17.29a.996.996 0 0 0 0-1.41L14.42 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L12.3 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"
              />
              <path
                fill="currentColor"
                d="M11.7 17.29a.996.996 0 0 0 0-1.41L7.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L5.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.38.38 1.01.38 1.4-.01"
              />
            </svg>
          </button>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Explore;
