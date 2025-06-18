"use client";

import React, { useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useInfiniteQuestions } from "@/hooks/api/questions";
import QuestionCard from "@/components/QuestionCard";
import { Loader2, AlertCircle } from "lucide-react";

interface VirtualizedQuestionListProps {
  filters?: {
    tag?: string;
    search?: string;
  };
  height?: number;
  itemHeight?: number;
}

interface QuestionItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    questions: any[];
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    loadNextPage: () => void;
  };
}

const QuestionItem: React.FC<QuestionItemProps> = ({ index, style, data }) => {
  const { questions, hasNextPage, isNextPageLoading, loadNextPage } = data;

  // Load more items if we're approaching the end
  const question = questions[index];

  if (!question) {
    if (hasNextPage) {
      loadNextPage();
      return (
        <div style={style} className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      );
    }
    return (
      <div
        style={style}
        className="flex items-center justify-center p-4 text-gray-500"
      >
        No more questions
      </div>
    );
  }

  return (
    <div style={style} className="p-2">
      <QuestionCard ques={question} />
    </div>
  );
};

export default function VirtualizedQuestionList({
  filters = {},
  height = 600,
  itemHeight = 200,
}: VirtualizedQuestionListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuestions(filters);

  // Flatten all pages into a single array
  const questions = useMemo(() => {
    return data?.pages.flatMap((page) => page.documents) || [];
  }, [data]);

  // Calculate total item count including loading placeholders
  const itemCount = hasNextPage ? questions.length + 1 : questions.length;

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index: number) => !!questions[index],
    [questions],
  );

  // Load more items
  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!isFetchingNextPage && hasNextPage) {
        await fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  // Prepare data for items
  const itemData = useMemo(
    () => ({
      questions,
      hasNextPage,
      isNextPageLoading: isFetchingNextPage,
      loadNextPage: fetchNextPage,
    }),
    [questions, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-gray-400">Failed to load questions</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="text-6xl">🤔</div>
          <p className="text-gray-400">No questions found</p>
          <p className="text-sm text-gray-500">
            Be the first to ask a question in this category!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        threshold={5} // Start loading when 5 items from the end
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            height={height}
            itemCount={itemCount}
            itemSize={itemHeight}
            onItemsRendered={onItemsRendered}
            itemData={itemData}
            overscanCount={3} // Render 3 extra items for smooth scrolling
            className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300"
          >
            {QuestionItem}
          </List>
        )}
      </InfiniteLoader>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-400">Loading more questions...</span>
        </div>
      )}
    </div>
  );
}
