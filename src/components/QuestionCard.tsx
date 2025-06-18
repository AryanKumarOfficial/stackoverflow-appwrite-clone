"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/Models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref.current?.clientHeight]);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10 sm:flex-row"
    >
      <BorderBeam size={height} duration={12} delay={9} />

      {/* Stats */}
      <div className="relative shrink-0 flex flex-row gap-4 sm:flex-col sm:text-right">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-400">
            {ques.totalVotes}
          </div>
          <div className="text-xs text-gray-400">votes</div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`text-2xl font-bold ${ques.totalAnswers > 0 ? "text-green-400" : "text-gray-400"}`}
          >
            {ques.totalAnswers}
          </div>
          <div className="text-xs text-gray-400">answers</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full space-y-4">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="block group-hover:scale-[1.01] transition-transform duration-300"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white hover:text-blue-400 transition-colors duration-300 leading-tight">
            {ques.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-300 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-blue-200 transition-all duration-300"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Author and Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-3">
            <picture>
              <img
                src={avatars.getInitials(ques.author?.name, 32, 32)?.href}
                alt={ques.author?.name}
                className="rounded-full border-2 border-white/10 hover:border-blue-400/50 transition-all duration-300"
              />
            </picture>
            <div className="flex flex-col">
              <Link
                href={`/users/${ques.author?.$id}/${slugify(ques.author?.name)}`}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                {ques.author?.name}
              </Link>
              <div className="text-xs text-gray-400">
                <span className="font-semibold text-yellow-400">
                  {ques.author?.reputation}
                </span>{" "}
                reputation
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
