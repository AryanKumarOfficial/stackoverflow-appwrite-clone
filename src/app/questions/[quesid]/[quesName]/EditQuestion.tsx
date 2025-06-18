"use client";

import { databases } from "@/Models/client/config";
import { answerCollection, db } from "@/Models/name";
import { useAuthStore } from "@/store/AuthStore";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Query } from "appwrite";

const EditQuestion = ({
  questionId,
  questionTitle,
  authorId,
}: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}) => {
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
  return user?.$id === authorId ? (
    <div className="relative">
      {!hasAnswers ? (
        <Link
          href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
          className="flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10"
          title="Edit question"
        >
          <IconEdit className="h-4 w-4" />
        </Link>
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500 p-1 text-gray-500 cursor-not-allowed"
          title="Cannot edit questions with answers"
        >
          <IconEdit className="h-4 w-4" />
          <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Cannot edit questions with answers
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default EditQuestion;
