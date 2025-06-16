import {db, questionCollection} from "@/Models/name";
import {databases} from "@/Models/server/config";
import React from "react";
import EditQues from "./EditQues";

// Disable caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page = async ({params}: { params: { quesid: string; quesName: string } }) => {
    try {
        const question = await databases.getDocument(db, questionCollection, params.quesid);
        return <EditQues question={question}/>;
    } catch (error) {
        console.error("Failed to get question:", error);
        return <div className="container mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p>Failed to load the question. It may have been deleted or you don't have permission to view it.</p>
        </div>;
    }
};

export default Page;