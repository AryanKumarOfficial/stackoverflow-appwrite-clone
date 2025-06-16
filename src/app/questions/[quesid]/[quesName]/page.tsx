import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import {MarkdownPreview} from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import {avatars, storage} from "@/Models/client/config";
import {
    answerCollection,
    commentCollection,
    db,
    questionAttachmentBucket,
    questionCollection,
    voteCollection,
} from "@/Models/name";
import {databases, users} from "@/Models/server/config";
import {UserPrefs} from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import {Query} from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import {TracingBeam} from "@/components/ui/tracing-beam";

// Disable caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page = async ({params}: { params: { quesid: string; quesName: string } }) => {
    try {
        const [question, answers, upvotes, downvotes, comments] = await Promise.all([
            databases.getDocument(db, questionCollection, params.quesid),
            databases.listDocuments(db, answerCollection, [
                Query.orderDesc("$createdAt"),
                Query.equal("questionId", params.quesid),]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("typeId", params.quesid),
                Query.equal("type", "question"),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1), // for optimization
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("typeId", params.quesid),
                Query.equal("type", "question"),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1), // for optimization
            ]), databases.listDocuments(db, commentCollection, [
                Query.equal("type", "question"),
                Query.equal("typeId", params.quesid),
                Query.orderDesc("$createdAt"),
            ]),]);

        // since it is dependent on the question, we fetch it here outside of the Promise.all
        let author;
        try {
            author = await users.get<UserPrefs>(question.authorId);
        } catch (error) {
            console.error("Failed to get author:", error);
            // Create a fallback author object if the user is not found
            author = {
                $id: "unknown",
                name: "Unknown User",
                prefs: {reputation: 0},
            };
        }

        [comments.documents, answers.documents] = await Promise.all([
            Promise.all(
                comments.documents.map(async comment => {
                    let commentAuthor;
                    try {
                        commentAuthor = await users.get<UserPrefs>(comment.authorId);
                    } catch (error) {
                        console.error(`Failed to get comment author for comment ${comment.$id}:`, error);
                        commentAuthor = {
                            $id: "unknown",
                            name: "Unknown User",
                            prefs: {reputation: 0},
                        };
                    }
                    return {
                        ...comment,
                        author: {
                            $id: commentAuthor.$id,
                            name: commentAuthor.name,
                            reputation: commentAuthor.prefs.reputation,
                        },
                    };
                })
            ), Promise.all(
                answers.documents.map(async answer => {
                    let answerAuthor, comments, upvotes, downvotes;
                    try {
                        [answerAuthor, comments, upvotes, downvotes] = await Promise.all([
                            users.get<UserPrefs>(answer.authorId),
                            databases.listDocuments(db, commentCollection, [
                                Query.equal("typeId", answer.$id),
                                Query.equal("type", "answer"),
                                Query.orderDesc("$createdAt"),
                            ]),
                            databases.listDocuments(db, voteCollection, [
                                Query.equal("typeId", answer.$id),
                                Query.equal("type", "answer"),
                                Query.equal("voteStatus", "upvoted"),
                                Query.limit(1), // for optimization
                            ]),
                            databases.listDocuments(db, voteCollection, [
                                Query.equal("typeId", answer.$id),
                                Query.equal("type", "answer"),
                                Query.equal("voteStatus", "downvoted"),
                                Query.limit(1), // for optimization
                            ]),
                        ]);
                    } catch (error) {
                        console.error(`Failed to get data for answer ${answer.$id}:`, error);
                        // Provide fallback values if user not found
                        answerAuthor = {
                            $id: "unknown",
                            name: "Unknown User",
                            prefs: {reputation: 0},
                        };
                        comments = {documents: [], total: 0};
                        upvotes = {documents: [], total: 0};
                        downvotes = {documents: [], total: 0};
                    }
                    comments.documents = await Promise.all(
                        comments.documents.map(async comment => {
                            let commentAuthor;
                            try {
                                commentAuthor = await users.get<UserPrefs>(comment.authorId);
                            } catch (error) {
                                console.error(`Failed to get comment author for answer comment ${comment.$id}:`, error);
                                commentAuthor = {
                                    $id: "unknown",
                                    name: "Unknown User",
                                    prefs: {reputation: 0},
                                };
                            }
                            return {
                                ...comment,
                                author: {
                                    $id: commentAuthor.$id,
                                    name: commentAuthor.name,
                                    reputation: commentAuthor.prefs.reputation,
                                },
                            };
                        })
                    );
                    return {
                        ...answer,
                        comments,
                        upvotesDocuments: upvotes,
                        downvotesDocuments: downvotes,
                        author: {
                            $id: answerAuthor.$id,
                            name: answerAuthor.name,
                            reputation: answerAuthor.prefs.reputation,
                        },
                    };
                })
            ),
        ]);

        return (
            <TracingBeam className="container pl-6">
                <Particles
                    className="fixed inset-0 h-full w-full"
                    quantity={500}
                    ease={100}
                    color="#ffffff"
                    refresh
                />
                <div className="relative mx-auto px-4 pb-20 pt-36">
                    <div className="flex">
                        <div className="w-full">
                            <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
                            <div className="flex gap-4 text-sm">
                                <React.Fragment>
                                <span>
                                    Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
                                </span>
                                    <span className={`${answers.total > 0 ? 'font-bold text-green-500' : ''}`}>
                                    Answers: {answers.total}
                                        {answers.total > 0 && (
                                            <span className="ml-1 text-xs text-gray-400">
                                            (Cannot edit/delete questions with answers)
                                        </span>
                                        )}
                                </span>
                                    <span>Votes: {upvotes.total + downvotes.total}</span>
                                </React.Fragment>
                            </div>
                        </div>
                        <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
                            <ShimmerButton className="shadow-2xl">
                            <span
                                className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a question
                            </span>
                            </ShimmerButton>
                        </Link>
                    </div>
                    <hr className="my-4 border-white/40"/>
                    <div className="flex gap-4">
                        <div className="flex shrink-0 flex-col items-center gap-4">
                            <VoteButtons
                                type="question"
                                id={question.$id}
                                className="w-full"
                                upvotes={upvotes}
                                downvotes={downvotes}
                            />
                            <EditQuestion
                                questionId={question.$id}
                                questionTitle={question.title}
                                authorId={question.authorId}
                            />
                            <DeleteQuestion questionId={question.$id} authorId={question.authorId}/>
                        </div>
                        <div className="w-full overflow-auto">
                            <MarkdownPreview className="rounded-xl p-4" source={question.content}/>
                            <picture>
                                <img
                                    src={
                                        storage.getFileView(
                                            questionAttachmentBucket,
                                            question.attachmentId
                                        ).href
                                    }
                                    alt={question.title}
                                    className="mt-3 rounded-lg"
                                />
                            </picture>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                {question.tags.map((tag: string) => (
                                    <Link
                                        key={tag}
                                        href={`/questions?tag=${tag}`}
                                        className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-1">
                                <picture>
                                    <img
                                        src={avatars.getInitials(author.name, 36, 36).href}
                                        alt={author.name}
                                        className="rounded-lg"
                                    />
                                </picture>
                                <div className="block leading-tight">
                                    <Link
                                        href={`/users/${author.$id}/${slugify(author.name)}`}
                                        className="text-orange-500 hover:text-orange-600"
                                    >
                                        {author.name}
                                    </Link>
                                    <p>
                                        <strong>{author.prefs.reputation}</strong>
                                    </p>
                                </div>
                            </div>
                            <Comments
                                comments={comments}
                                className="mt-4"
                                type="question"
                                typeId={question.$id}
                            />
                            <hr className="my-4 border-white/40"/>
                        </div>
                    </div>
                    <Answers answers={answers} questionId={question.$id}/>
                </div>
            </TracingBeam>
        );
    } catch (error) {
        console.error("Failed to render question page:", error);
        return (
            <div className="container mx-auto mt-10 p-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p>Failed to load the question. It may have been deleted or you don't have permission to view it.</p>
                <div className="mt-4">
                    <a href="/questions" className="text-blue-500 hover:underline">Back to Questions</a>
                </div>
            </div>
        );
    }
};

export default Page;