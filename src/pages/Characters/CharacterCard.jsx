import { Star } from 'lucide-react';
import React, { useState } from 'react';
import CharacterInfoModal from './CharacterInfoModal.jsx';

const CharacterCard = ({ character }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleViewCharacter = () => {
        setIsOpen(true)
    }
    
    return (
        <div
        onClick={handleViewCharacter}
        className="w-full h-fit rounded-lg bg-transparent cursor-pointer relative overflow-hidden flex flex-col items-center justify-center"
        >
        <div className="absolute z-[999] top-1 left-2 bg-pink-600 px-1 py-0.5 rounded flex items-center gap-0">
            <Star className='fill-amber-500 text-amber-500' />

            <h2 className="text-gray-300 text-center w-full text-sm md:text-sm">
            {character?.favorites.toLocaleString()}
            </h2>
        </div>

        {/* Image */}
        <div className="rounded-lg overflow-hidden">
            <img
            src={character?.images?.webp?.image_url}
            alt={character?.name}
            className="w-full h-full hover:scale-105 object-cover rounded-lg brightness-70 aspect-[2/2.8]"
            />
        </div>

        {/* Info */}
        <div className="w-full px-3 py-1 bottom-0 bg-transparent sm:h-[25%] md:h-[20%] rounded-b-lg flex">
            <div className="flex flex-col items-start w-full h-full justify-around">
            <h2 className="text-white text-center text-sm md:text-[0.9rem] mt-1 line-clamp-2 w-full">
                {character?.name}
            </h2>

            <h2 className="text-gray-300 text-center w-full text-sm md:text-sm mt-2">
                {character?.role}
            </h2>
            </div>
        </div>
        {isOpen && <CharacterInfoModal character={character} />}
    </div>
    );
};

export default CharacterCard;
