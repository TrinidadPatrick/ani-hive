import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import AnimeReviewsSkeleton from './skeleton/AnimeReviewsSkeleton';

const Reviews = ({mal_id}) => {
    const reactionEmojis = ["📊", "👍", "❤️", "😂", "🤔", "📘", "✍️", "🎨"];

    const [reviews, setReviews] = useState(null);
    const [indexSeeMore, setIndexSeeMore] = useState([])
    const [indexSeeReview, setIndexSeeReview] = useState([])

    const textRef = useRef(null);

    const getUserReviews = async (mal_id, retries = 10) => {
        try {
            const result = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/reviews`)
                if(result.status === 200) {
                    const reviews = result.data.data
                    const sortedReviews = reviews.sort((a,b) => new Date(b.date) - new Date(a.date))
                    setReviews(sortedReviews)
                }
        } catch (error) {
            console.log(error)
            if(retries > 0)
            {
                setTimeout(()=>{
                    getUserReviews(mal_id, retries - 1)
                }, 1000)
            }
        }
    }

    const handleSeeMore = (index) => {
        const newIndex = indexSeeMore.findIndex((item) => item === index)
        if(newIndex !== -1){
            const newIndexSeeMore = [...indexSeeMore]
            newIndexSeeMore.splice(newIndex, 1)
            setIndexSeeMore(newIndexSeeMore)
        }else{
            const newIndexSeeMore = [...indexSeeMore, index]
            setIndexSeeMore(newIndexSeeMore)
        }
    }

    useEffect(() => {
        if(mal_id){
            getUserReviews(mal_id)
        }
    }, [mal_id])
    
    
    return (
    <div className="w-full flex flex-col gap-3">
        <div>
            <h1 className="text-white text-xl md:text-2xl font-bold">Reviews</h1>
        </div>

        {reviews && reviews?.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-gray-500 text-2xl">No Reviews</h1>
            </div>
        )}

        <div className="w-full h-full flex flex-col gap-2">
            {reviews && reviews?.length > 0 ? (
            reviews.map((review, index, array) => {
                const textLength = review.review.length;
                const date = new Date(review.date);
                const dateString = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                });

                return (
                <div key={index} className="w-full flex gap-2">
                    <div className="w-[50px] aspect-[2/2.3] flex-none">
                    <img
                        src={review?.user?.images?.jpg.image_url}
                        alt={review?.author?.name}
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                    </div>

                    <div className="flex flex-col justify-between py-0 items-start">
                    <div className="flex flex-col gap-1">
                        {/* Date and name */}
                        <div className="flex justify-between">
                        <h2 className="text-white font-medium text-sm md:text-base line-clamp-2">
                            {review?.user?.username}
                        </h2>
                        <p className="text-gray-400 text-sm">{dateString}</p>
                        </div>

                        {/* Tag */}
                        <div className="flex gap-3">
                        {review?.tags?.length > 0 &&
                            review?.tags.map((tag, index, array) => {
                            return (
                                <div
                                key={index}
                                className="px-2 py-0.5 bg-[#ff96d812] rounded"
                                >
                                <h1 className="text-pink-400 text-xs font-medium">
                                    {tag}
                                </h1>
                                </div>
                            );
                            })}
                        </div>

                        {/* Review Content */}
                        <div className="relative">
                        {/* Spoiler Warning */}
                        {!indexSeeReview.includes(index) &&
                            review?.is_spoiler && (
                            <div className="absolute w-full h-full backdrop-blur-xs rounded-lg z-[9999999] flex flex-col justify-center items-center">
                                <h1 className="text-white text-lg font-bold">
                                Spoiler Warning
                                </h1>
                                <p className="text-white text-sm">
                                This review contains spoilers
                                </p>
                                <button
                                onClick={() => handleSeeReview(index)}
                                className="text-white px-2 py-1 bg-pink-400 hover:bg-pink-500 rounded text-sm cursor-pointer hover:text-gray-200 w-fit"
                                >
                                See review
                                </button>
                            </div>
                            )}

                        {textLength <= 1200 ? (
                            <p className="text-gray-200 text-sm whitespace-pre-line">
                            {review?.review}
                            </p>
                        ) : (
                            <p
                            ref={textRef}
                            className={`text-gray-300 text-sm whitespace-pre-line transition-all duration-300 ease-in-out overflow-hidden ${
                                indexSeeMore.includes(index)
                                ? "max-h-[1000px]"
                                : "max-h-[8.5rem] line-clamp-6"
                            }`}
                            >
                            {review?.review}
                            </p>
                        )}

                        {/* See More Button */}
                        {textLength > 1200 && (
                            <button
                            onClick={() => {
                                handleSeeMore(index);
                            }}
                            className="text-white text-sm cursor-pointer hover:text-gray-200 w-fit"
                            >
                            {indexSeeMore.includes(index) ? "see less" : "see more"}
                            </button>
                        )}
                        </div>

                        <div className="flex gap-3 flex-wrap p-2 bg-[#34343438] rounded">
                        {Object.entries(review.reactions).map(
                            ([key, value], index) => {
                            const reaction =
                                key.charAt(0).toUpperCase() +
                                key.slice(1).replace("_", " ");

                            return (
                                <p
                                key={index}
                                className="text-white text-xs sm:text-sm font-light px-2 py-1 border rounded border-gray-400"
                                >
                                {reaction} {reactionEmojis[index]}: {value}
                                </p>
                            );
                            }
                        )}
                        </div>
                    </div>
                    </div>
                </div>
                );
            })
            ) : (
            !reviews && <AnimeReviewsSkeleton />
            )}
        </div>
    </div>

  )
}

export default Reviews