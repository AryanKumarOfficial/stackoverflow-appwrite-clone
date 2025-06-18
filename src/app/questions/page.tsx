"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import VirtualizedQuestionList from "@/components/VirtualizedQuestionList";
import { AdvancedSearch } from "@/components/DebouncedSearch";
import Particles from "@/components/magicui/particles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Filter, Grid, List } from "lucide-react";

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "votes" | "answers"
  >("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  const handleSortChange = useCallback(
    (sort: "newest" | "oldest" | "votes" | "answers") => {
      setSortBy(sort);
    },
    [],
  );

  // Prepare filters for the API
  const filters = {
    search: searchQuery,
    tags: selectedTags,
    sortBy,
  };

  return (
    <TracingBeam className="container pl-6">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={300}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="mx-auto px-4 pb-20 pt-36 relative z-10">
        {/* Header Section */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              All Questions
            </h1>
            <p className="text-gray-400">
              Explore questions from our developer community
            </p>
          </div>
          <Link href="/questions/ask">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Ask a Question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <AdvancedSearch
            onSearch={handleSearch}
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            placeholder="Search questions by title, content, or tags..."
            className="w-full"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">View:</span>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedTags.length > 0 || searchQuery || sortBy !== "newest") && (
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">
                {selectedTags.length > 0 &&
                  `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""}`}
                {searchQuery && ` • searching "${searchQuery}"`}
                {sortBy !== "newest" && ` • sorted by ${sortBy}`}
              </span>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="w-full">
          <VirtualizedQuestionList
            filters={filters}
            height={800}
            itemHeight={viewMode === "grid" ? 300 : 220}
          />
        </div>
      </div>
    </TracingBeam>
  );
}
