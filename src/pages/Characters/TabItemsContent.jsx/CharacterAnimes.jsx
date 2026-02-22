import React from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

const CharacterAnimes = ({ content }) => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 gap-2 grid grid-cols-2 sm:grid-cols-3">
      {content.map((anime, index) => {
        return (
          <div
            onClick={() =>
              navigate(
                `/anime/${anime.anime.mal_id}?title=${slugify(anime.anime.title)}`,
              )
            }
            key={index}
            className="flex flex-col"
          >
            {/* Image container */}
            <div className="flex flex-col aspect-[2/3] overflow-hidden rounded">
              <img
                src={anime.anime.images.jpg.image_url}
                className="object-center object-cover w-full h-full hover:scale-105"
              />
            </div>
            <div className="mt-1">
              <h3 className="text-gray-300 text-sm">{anime.anime.title}</h3>
            </div>
            <div>
              <span className="text-pink-600 bg-pink-300/20 px-2 py-0.5 text-xs rounded-md">
                {anime.role}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterAnimes;
