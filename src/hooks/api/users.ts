"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { users } from "@/Models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";

// User API interfaces
export interface User {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
  $updatedAt: string;
  prefs?: UserPrefs;
}

// Query keys for users
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  topContributors: () => [...userKeys.all, "topContributors"] as const,
};

// Hook for top contributors with smart caching
export function useTopContributors(limit = 10) {
  return useQuery({
    queryKey: userKeys.topContributors(),
    queryFn: async () => {
      const response = await users.list<UserPrefs>([
        Query.limit(50), // Fetch more to filter and sort
      ]);

      // Filter, deduplicate, and sort by reputation
      const seen = new Set<string>();
      const filtered = response.users
        .filter(
          (u) =>
            u.email &&
            !isNaN(Number(u.prefs?.reputation)) &&
            Number(u.prefs?.reputation || 0) > 0,
        )
        .filter((u) => {
          if (seen.has(u.$id)) return false;
          seen.add(u.$id);
          return true;
        })
        .sort(
          (a, b) =>
            Number(b.prefs?.reputation || 0) - Number(a.prefs?.reputation || 0),
        )
        .slice(0, limit);

      return filtered;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for individual user details
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      return await users.get<UserPrefs>(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (user not found)
      if (error?.code === 404) return false;
      return failureCount < 2;
    },
  });
}

// Hook for updating user reputation
export function useUpdateUserReputation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; change: number }) => {
      const user = await users.get<UserPrefs>(data.userId);
      const currentReputation = user.prefs?.reputation || 0;
      const newReputation = Math.max(0, currentReputation + data.change);

      return await users.updatePrefs(data.userId, {
        reputation: newReputation,
      });
    },
    onMutate: async (data) => {
      // Optimistically update user reputation
      const userKey = userKeys.detail(data.userId);
      await queryClient.cancelQueries({ queryKey: userKey });

      const previousUser = queryClient.getQueryData(userKey);

      queryClient.setQueryData(userKey, (old: User | undefined) => {
        if (!old) return old;
        const currentReputation = old.prefs?.reputation || 0;
        const newReputation = Math.max(0, currentReputation + data.change);
        return {
          ...old,
          prefs: {
            ...old.prefs,
            reputation: newReputation,
          },
        };
      });

      return { previousUser, userKey };
    },
    onError: (err, data, context) => {
      // Rollback on error
      if (context?.previousUser && context?.userKey) {
        queryClient.setQueryData(context.userKey, context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.topContributors() });
    },
  });
}

// Batch user fetching for performance
export function useBatchUsers(userIds: string[]) {
  return useQuery({
    queryKey: [...userKeys.all, "batch", userIds.sort()],
    queryFn: async () => {
      // Fetch users in parallel with error handling
      const userPromises = userIds.map(async (id) => {
        try {
          return await users.get<UserPrefs>(id);
        } catch (error) {
          // Return fallback user on error
          return {
            $id: id,
            name: "Unknown User",
            email: "unknown@example.com",
            $createdAt: "",
            $updatedAt: "",
            prefs: { reputation: 0 },
          };
        }
      });

      return Promise.all(userPromises);
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
