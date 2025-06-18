import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/Models/name";
import { databases, users } from "@/Models/server/config";
import { Query } from "node-appwrite";
import Link from "next/link";
import React from "react";

const LatestQuestions = async () => {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.limit(5),
  ]);
  console.log("Fetched Questions:", questions);
  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      // Log the question to see what fields are available
      console.log("Question fields:", Object.keys(ques));

      // Try to find the correct user ID field (might be authorId instead of userId)
      const userId = ques.authorId || ques.userId;

      if (!userId) {
        console.error("No user ID found for question:", ques.$id);
        return {
          ...ques,
          totalAnswers: 0,
          totalVotes: 0,
          author: {
            $id: "unknown",
            reputation: 0,
            name: "Unknown User",
          },
        };
      }

      try {
        const [author, answers, votes] = await Promise.all([
          users.get(userId),
          databases.listDocuments(db, answerCollection, [
            Query.equal("questionId", ques.$id),
            Query.limit(1), // for optimization
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", ques.$id),
            Query.limit(1), // for optimization
          ]),
        ]);
        return {
          ...ques,
          totalAnswers: answers.total,
          totalVotes: votes.total,
          author: {
            $id: author.$id,
            reputation: author.prefs?.reputation || 0,
            name: author.name,
          },
        };
      } catch (error) {
        console.error(`Error fetching data for question ${ques.$id}:`, error);
        return {
          ...ques,
          totalAnswers: 0,
          totalVotes: 0,
          author: {
            $id: "unknown",
            reputation: 0,
            name: "Unknown User",
          },
        };
      }
    }),
  );

  console.log("Latest question");
  console.log(questions);
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
