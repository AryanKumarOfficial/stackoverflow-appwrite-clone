"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useTopContributors } from "@/hooks/api/users";
import { Models } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { avatars } from "@/Models/client/config";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface UserNotificationProps {
  user: Models.User<UserPrefs>;
}

const UserNotification = ({
  user,
  rank,
}: UserNotificationProps & { rank: number }) => {
  // Safe access to potentially undefined properties
  const userName = user.name || "Unknown User";
  const reputation = user.prefs?.reputation || 0;
  const updatedAt = user.$updatedAt ? new Date(user.$updatedAt) : new Date();

  return (
    <figure
      className={cn(
        "relative group mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-300",
        "bg-gradient-to-br from-[#23234d]/80 to-[#0f3460]/80 border border-white/10 shadow-lg hover:scale-[1.03] hover:shadow-pink-400/30 hover:border-pink-400/40",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-pink-400/10 before:to-indigo-400/10 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300",
      )}
      // style={{ zIndex: 10 - rank }}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="relative">
          <picture>
            <img
              src={avatars.getInitials(userName, 48, 48).href}
              alt={userName}
              className="rounded-full border-2 border-pink-400/40 shadow-md group-hover:border-indigo-400/60 transition-all duration-300"
            />
          </picture>
          <span
            className={cn(
              "absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-400 text-xs font-bold text-white shadow-md",
              rank === 1 ? "scale-110" : "",
            )}
          >
            {rank}
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-semibold text-white/90 group-hover:text-pink-400 transition-colors duration-300">
            <span className="truncate max-w-[140px]">{userName}</span>
            <span className="mx-2 text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {convertDateToRelativeTime(updatedAt)}
            </span>
          </figcaption>
          <p className="text-xs font-medium text-gray-300 group-hover:text-indigo-300 transition-colors duration-300 mt-1">
            <span>Reputation</span>
            <span className="mx-1">·</span>
            <span className="font-bold text-pink-400 group-hover:text-indigo-400 transition-colors duration-300">
              {reputation}
            </span>
          </p>
        </div>
      </div>
      <Link
        href={`/users/${user.$id}/${encodeURIComponent(userName)}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-label={`View ${userName}'s profile`}
      />
    </figure>
  );
};

export default function TopContributors() {
  const {
    data: topUsers,
    isLoading,
    isError,
    error,
    refetch,
  } = useTopContributors(10);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Top Contributors
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrating our most active community members
          </p>
        </div>

        <div className="relative flex max-h-[600px] min-h-[500px] w-full max-w-[40rem] mx-auto flex-col overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#1a1a2e]/90 via-[#23234d]/90 to-[#0f3460]/90 shadow-2xl border border-white/10 backdrop-blur-lg">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" />
              <p className="text-gray-400">Loading top contributors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Top Contributors
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrating our most active community members
          </p>
        </div>

        <div className="relative flex max-h-[600px] min-h-[500px] w-full max-w-[40rem] mx-auto flex-col overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#1a1a2e]/90 via-[#23234d]/90 to-[#0f3460]/90 shadow-2xl border border-white/10 backdrop-blur-lg">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-gray-400">Failed to load contributors</p>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-medium transition-colors mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topUsers || topUsers.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Top Contributors
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrating our most active community members
          </p>
        </div>

        <div className="relative flex max-h-[600px] min-h-[500px] w-full max-w-[40rem] mx-auto flex-col overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#1a1a2e]/90 via-[#23234d]/90 to-[#0f3460]/90 shadow-2xl border border-white/10 backdrop-blur-lg">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">👥</div>
              <p className="text-gray-400">No contributors yet</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              >
                Be the First Contributor
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Top Contributors
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Celebrating our most active community members
        </p>
      </div>

      <div className="relative flex max-h-[600px] min-h-[500px] w-full max-w-[40rem] mx-auto flex-col overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#1a1a2e]/90 via-[#23234d]/90 to-[#0f3460]/90 shadow-2xl border border-white/10 backdrop-blur-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
        <AnimatedList className="relative z-10 w-full gap-6">
          {topUsers.map((user, idx) => (
            <UserNotification user={user} key={user.$id} rank={idx + 1} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
