"use client";

import { databases } from "@/Models/client/config";
import { answerCollection, db, questionCollection } from "@/Models/name";
import { useAuthStore } from "@/store/AuthStore";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Query } from "appwrite";
import toast from "react-hot-toast";

const DeleteQuestion = ({
  questionId,
  authorId,
}: {
  questionId: string;
  authorId: string;
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hasAnswers, setHasAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAnswers = async () => {
      try {
        setIsLoading(true);
        const answers = await databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", questionId),
          Query.limit(1),
        ]);
        setHasAnswers(answers.total > 0);
      } catch (error) {
        console.error("Error checking for answers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAnswers();
  }, [questionId]);
  const deleteQuestion = async () => {
    if (hasAnswers) {
      toast.error("Cannot delete question that has answers");
      return;
    }

    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await databases.deleteDocument(db, questionCollection, questionId);
      toast.success("Question deleted successfully");
      router.push("/questions");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };
  return user?.$id === authorId ? (
    <div className="relative">
      <button
        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
          hasAnswers
            ? "border-gray-500 text-gray-500 cursor-not-allowed"
            : "border-red-500 text-red-500 hover:bg-red-500/10 duration-200"
        }`}
        onClick={deleteQuestion}
        disabled={hasAnswers || isLoading}
        title={
          hasAnswers
            ? "Cannot delete questions with answers"
            : "Delete question"
        }
      >
        <IconTrash className="h-4 w-4" />
      </button>
      {hasAnswers && (
        <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          Cannot delete questions with answers
        </div>
      )}
    </div>
  ) : null;
};

export default DeleteQuestion;
