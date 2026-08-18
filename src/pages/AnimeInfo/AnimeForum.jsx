import React, { useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ForumTopicCard = React.memo(({ topic }) => {
  const navigate = useNavigate()
  const formattedDate = useMemo(() => formatDate(topic.date), [topic.date]);
  const formattedLastCommentDate = useMemo(
    () => formatDate(topic.last_comment?.date),
    [topic.last_comment?.date]
  );

  return (
    <div onClick={()=>window.open(topic.url, "_blank", "noopener,noreferrer")} className="group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 transition-colors duration-150 gap-2 shrink-0 [transform:translateZ(0)]">
      <div className="flex-1 min-w-0">
        <a
          href={topic.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors duration-150 line-clamp-1 block"
        >
          {topic.title}
        </a>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
          <span>
            By{" "}
            <a
              href={topic.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:underline"
            >
              {topic.author_username}
            </a>
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {topic.last_comment && (
          <div className="text-left sm:text-right text-[11px] text-neutral-400">
            <p className="line-clamp-1">
              Last by{" "}
              <a
                href={topic.last_comment.author_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-200 font-medium hover:underline"
              >
                {topic.last_comment.author_username}
              </a>
            </p>
            {formattedLastCommentDate && (
              <p className="text-neutral-500 text-[10px]">
                {formattedLastCommentDate}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 text-pink-400 font-medium text-xs border border-neutral-700/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{topic.comments}</span>
        </div>
      </div>
    </div>
  );
});

const AnimeForum = ({ id }) => {
  const {
    data: animeForum,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["animeForum", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_PRIMARY_URL}/anime/${id}/forum`
      );
      return data.data;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="w-full my-8 text-neutral-400 text-sm animate-pulse">
        Loading discussions...
      </div>
    );
  }

  if (isError || !animeForum || animeForum.length === 0) return null;

  const topics = animeForum;

  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-xl md:text-2xl font-bold">
            Recent Forum Discussions
          </h1>
        </div>
        <span className="text-xs text-neutral-400">
          Showing {topics.length} topics
        </span>
      </div>

      <div className="max-h-[340px] overflow-y-auto pr-1 flex flex-col gap-2.5 [transform:translateZ(0)] [backface-visibility:hidden] scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {topics.map((topic) => (
          <ForumTopicCard key={topic.mal_id} topic={topic} />
        ))}
      </div>
    </section>
  );
};

export default AnimeForum;