"use client";

import QuestionForm from "@/components/QuestionFormComponent";
import {answerCollection, db} from "@/Models/name";
import {databases} from "@/Models/client/config";
import {useAuthStore} from "@/store/Auth";
import slugify from "@/utils/slugify";
import {Models, Query} from "appwrite";
import {useRouter} from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditQues = ({question}: { question: Models.Document }) => {
    const {user} = useAuthStore();
    const router = useRouter();
    const [hasAnswers, setHasAnswers] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is author
        if (question.authorId !== user?.$id) {
            router.push(`/questions/${question.$id}/${slugify(question.title)}`);
            return;
        }

        // Check if question has answers
        const checkAnswers = async () => {
            try {
                setIsLoading(true);
                const answers = await databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", question.$id),
                    Query.limit(1),
                ]);
                  if (answers.total > 0) {
                    setHasAnswers(true);
                    // Redirect back to the question page if it has answers
                    router.push(`/questions/${question.$id}/${slugify(question.title)}`);
                    toast.error("Cannot edit questions that have answers");
                }
            } catch (error) {
                console.error("Error checking for answers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAnswers();
    }, [question, user, router]);    if (user?.$id !== question.authorId) return null;
    if (isLoading) return <div className="block pb-20 pt-32 container mx-auto px-4">Loading...</div>;
    if (hasAnswers) return null;

    return (
        <div className="block pb-20 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="mb-10 mt-4 text-2xl">Edit your public question</h1>
                <p className="mb-6 text-sm text-gray-400">
                    Note: Questions can only be edited if they have no answers.
                </p>

                <div className="flex flex-wrap md:flex-row-reverse">
                    <div className="w-full md:w-1/3"></div>
                    <div className="w-full md:w-2/3">
                        <QuestionForm ques={question}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQues;