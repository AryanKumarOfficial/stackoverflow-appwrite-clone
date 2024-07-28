import {db, questionCollection} from "@/Models/name";
import {databases} from "@/Models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({params}: { params: { quesId: string; quesName: string } }) => {
    const question = await databases.getDocument(db, questionCollection, params.quesId);

    return <EditQues question={question}/>;
};

export default Page;