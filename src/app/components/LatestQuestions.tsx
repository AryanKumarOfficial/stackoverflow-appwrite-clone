import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/Models/name";
import { databases, users } from "@/Models/server/config";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.limit(5),
    ]);
    console.log("Fetched Questions:", questions);    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
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
                    ]),                ]);
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
        })
    );

    console.log("Latest question")
    console.log(questions)
    return (
        <div className="space-y-6">
            {questions.documents.map(question => (
                <QuestionCard key={question.$id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;