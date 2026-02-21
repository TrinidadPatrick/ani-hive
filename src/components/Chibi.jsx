import React, { useState } from "react";
import chibi from "../images/chibiV2.gif";

const Chibi = ({ handleScroll }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      className="fixed w-[80px] sm:w-[100px]  group aspect-square cursor-pointer bottom-2 right-0 z-[999999999]"
    >
      <img src={chibi} alt="chibi" className=" w-full h-full object-cover " />
      {isOpen && (
        <div className="absolute bottom-[100%] left-1/4 transform -translate-x-1/2">
          <div className="relative bg-themeDark border py-2 border-themeLightDark text-sm flex flex-col gap-3 text-white px-3 rounded-lg shadow-lg origin-bottom">
            <button
              onClick={() => {
                handleScroll("top");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Top Section
            </button>
            <button
              onClick={() => {
                handleScroll("top-animes");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Top Rated Animes
            </button>
            <button
              onClick={() => {
                handleScroll("season-now");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Popular this season
            </button>
            <button
              onClick={() => {
                handleScroll("ongoing");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Ongoing Animes
            </button>
            <button
              onClick={() => {
                handleScroll("airing-today");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Airing Today Animes
            </button>
            <button
              onClick={() => {
                handleScroll("upcoming");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Upcoming Animes
            </button>
            <button
              onClick={() => {
                handleScroll("movies");
                setIsOpen(false);
              }}
              className="whitespace-nowrap text-start cursor-pointer hover:text-gray-200"
            >
              Anime Movies
            </button>

            <div className="absolute left-[70%] -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-themeDark"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chibi;
