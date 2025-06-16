import {databases, users} from "@/Models/server/config";
import {UserPrefs} from "@/store/Auth";
import React from "react";
import {MagicCard, MagicContainer} from "@/components/magicui/magic-card";
import NumberTicker from "@/components/magicui/number-ticker";
import {answerCollection, db, questionCollection} from "@/Models/name";
import {Query} from "node-appwrite";
import Link from "next/link";

const Page = async ({params}: { params: { userId: string; userSlug: string } }) => {
    try {
        const [user, questions, answers] = await Promise.all([
            users.get<UserPrefs>(params.userId),
            databases.listDocuments(db, questionCollection, [
                Query.equal("authorId", params.userId),
                Query.limit(1), // for optimization
            ]),
            databases.listDocuments(db, answerCollection, [
                Query.equal("authorId", params.userId),
                Query.limit(1), // for optimization
            ]),
        ]);

        return (
            <MagicContainer className={"flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row"}>
                <MagicCard
                    className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                    <div className="absolute inset-x-4 top-4">
                        <h2 className="text-xl font-medium">Reputation</h2>
                    </div>
                    <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                        <NumberTicker value={user.prefs?.reputation || 0}/>
                    </p>
                    <div
                        className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"/>
                </MagicCard>
                <MagicCard
                    className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                    <div className="absolute inset-x-4 top-4">
                        <h2 className="text-xl font-medium">Questions asked</h2>
                    </div>
                    <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                        <NumberTicker value={questions.total}/>
                    </p>
                    <div
                        className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"/>
                </MagicCard>
                <MagicCard
                    className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                    <div className="absolute inset-x-4 top-4">
                        <h2 className="text-xl font-medium">Answers given</h2>
                    </div>
                    <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                        <NumberTicker value={answers.total}/>
                    </p>
                    <div
                        className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"/>
                </MagicCard>
            </MagicContainer>
        );
    } catch (error) {
        console.error("Failed to load user profile:", error);
        return (
            <div className="container mx-auto mt-10 p-4">
                <h1 className="text-2xl font-bold text-red-500">User Not Found</h1>
                <p>The user you're looking for doesn't exist or has been deleted.</p>
                <div className="mt-4">
                    <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
                </div>
            </div>
        );
    }
};

export default Page;