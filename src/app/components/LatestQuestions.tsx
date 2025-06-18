"use client";

import React from "react";
import QuestionCard from "@/components/QuestionCard";
import { useLatestQuestions } from "@/hooks/api/questions";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

const LatestQuestions = () => {
  const {
    data: questions,
    isLoading,
    isError,
    error,
    refetch,
  } = useLatestQuestions(5);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Latest Questions
          </h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-400">Loading latest questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Latest Questions
          </h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-gray-400">Failed to load questions</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Latest Questions
          </h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-6xl">🤔</div>
            <p className="text-gray-400">No questions yet</p>
            <Link
              href="/questions/ask"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Ask the First Question
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Latest Questions
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Fresh questions from our community of developers
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-400 font-medium">
            Live Updates
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {questions.documents.map((question, index) => (
          <div
            key={question.$id}
            className="transform hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <QuestionCard ques={question} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/questions"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          <span>View All Questions</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default LatestQuestions;
