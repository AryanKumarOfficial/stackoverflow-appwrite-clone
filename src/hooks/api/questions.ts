"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { databases, users } from "@/Models/server/config";
import {
  db,
  questionCollection,
  answerCollection,
  voteCollection,
} from "@/Models/name";
import { Query } from "node-appwrite";
import { UserPrefs } from "@/store/AuthStore";

// Question API interfaces
export interface Question {
  $id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string;
  $createdAt: string;
  $updatedAt: string;
  totalAnswers?: number;
  totalVotes?: number;
  author?: {
    $id: string;
    name: string;
    reputation: number;
  };
}

interface QuestionsResponse {
  documents: Question[];
  total: number;
}

// Query keys factory for consistent caching
export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  infinite: (filters: Record<string, any>) =>
    [...questionKeys.all, "infinite", filters] as const,
};

// Enhanced question fetching with author data
async function fetchQuestionWithAuthor(question: any): Promise<Question> {
  try {
    const [author, answers, votes] = await Promise.all([
      users.get<UserPrefs>(question.authorId).catch(() => ({
        $id: "unknown",
        name: "Unknown User",
        prefs: { reputation: 0 },
      })),
      databases
        .listDocuments(db, answerCollection, [
          Query.equal("questionId", question.$id),
          Query.limit(1),
        ])
        .catch(() => ({ total: 0 })),
      databases
        .listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", question.$id),
          Query.limit(1),
        ])
        .catch(() => ({ total: 0 })),
    ]);

    return {
      ...question,
      totalAnswers: answers.total,
      totalVotes: votes.total,
      author: {
        $id: author.$id,
        name: author.name,
        reputation: author.prefs?.reputation || 0,
      },
    };
  } catch (error) {
    console.error(`Error fetching question ${question.$id}:`, error);
    return {
      ...question,
      totalAnswers: 0,
      totalVotes: 0,
      author: {
        $id: "unknown",
        name: "Unknown User",
        reputation: 0,
      },
    };
  }
}

// Infinite query for questions with virtual scrolling support
export function useInfiniteQuestions(
  filters: {
    tag?: string;
    search?: string;
    limit?: number;
  } = {},
) {
  const limit = filters.limit || 10;

  return useInfiniteQuery({
    queryKey: questionKeys.infinite(filters),
    queryFn: async ({ pageParam = 0 }) => {
      const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset(pageParam * limit),
        Query.limit(limit),
      ];

      if (filters.tag) queries.push(Query.equal("tags", filters.tag));
      if (filters.search) {
        queries.push(
          Query.or([
            Query.search("title", filters.search),
            Query.search("content", filters.search),
          ]),
        );
      }

      const response = await databases.listDocuments(
        db,
        questionCollection,
        queries,
      );

      // Enhance questions with author data in parallel
      const enhancedQuestions = await Promise.all(
        response.documents.map(fetchQuestionWithAuthor),
      );

      return {
        documents: enhancedQuestions,
        total: response.total,
        nextPage:
          (pageParam + 1) * limit < response.total ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for latest questions with smart caching
export function useLatestQuestions(limit = 5) {
  return useQuery({
    queryKey: questionKeys.list({ latest: true, limit }),
    queryFn: async () => {
      const response = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]);

      // Enhance with author data
      const enhancedQuestions = await Promise.all(
        response.documents.map(fetchQuestionWithAuthor),
      );

      return enhancedQuestions;
    },
    staleTime: 1 * 60 * 1000, // 1 minute for latest questions
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for individual question details
export function useQuestion(questionId: string) {
  return useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: async () => {
      const question = await databases.getDocument(
        db,
        questionCollection,
        questionId,
      );
      return fetchQuestionWithAuthor(question);
    },
    enabled: !!questionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Optimistic question creation mutation
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionData: {
      title: string;
      content: string;
      tags: string[];
      attachmentId?: string;
      authorId: string;
    }) => {
      return await databases.createDocument(
        db,
        questionCollection,
        "unique()",
        questionData,
      );
    },
    onMutate: async (newQuestion) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: questionKeys.lists() });

      // Snapshot previous value
      const previousQuestions = queryClient.getQueryData(
        questionKeys.list({ latest: true, limit: 5 }),
      );

      // Optimistically update cache
      const optimisticQuestion: Question = {
        $id: `temp-${Date.now()}`,
        title: newQuestion.title,
        content: newQuestion.content,
        tags: newQuestion.tags,
        authorId: newQuestion.authorId,
        attachmentId: newQuestion.attachmentId,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        totalAnswers: 0,
        totalVotes: 0,
        author: {
          $id: newQuestion.authorId,
          name: "You",
          reputation: 0,
        },
      };

      queryClient.setQueryData(
        questionKeys.list({ latest: true, limit: 5 }),
        (old: Question[] | undefined) => [optimisticQuestion, ...(old || [])],
      );

      return { previousQuestions };
    },
    onError: (err, newQuestion, context) => {
      // Rollback on error
      if (context?.previousQuestions) {
        queryClient.setQueryData(
          questionKeys.list({ latest: true, limit: 5 }),
          context.previousQuestions,
        );
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

// Question voting mutation with optimistic updates
export function useVoteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (voteData: {
      questionId: string;
      voteType: "upVote" | "downVote";
      userId: string;
    }) => {
      // Implementation would go to your vote API endpoint
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "question",
          typeId: voteData.questionId,
          voteStatus: voteData.voteType,
          votedById: voteData.userId,
        }),
      });

      if (!response.ok) throw new Error("Vote failed");
      return response.json();
    },
    onMutate: async (voteData) => {
      // Optimistically update vote count
      const questionKey = questionKeys.detail(voteData.questionId);
      await queryClient.cancelQueries({ queryKey: questionKey });

      const previousQuestion = queryClient.getQueryData(questionKey);

      queryClient.setQueryData(questionKey, (old: Question | undefined) => {
        if (!old) return old;
        const increment = voteData.voteType === "upVote" ? 1 : -1;
        return {
          ...old,
          totalVotes: (old.totalVotes || 0) + increment,
        };
      });

      return { previousQuestion, questionKey };
    },
    onError: (err, voteData, context) => {
      // Rollback on error
      if (context?.previousQuestion && context?.questionKey) {
        queryClient.setQueryData(context.questionKey, context.previousQuestion);
      }
    },
    onSettled: (data, error, voteData) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(voteData.questionId),
      });
    },
  });
}
