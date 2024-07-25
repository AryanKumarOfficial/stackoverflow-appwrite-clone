import {db} from "@/Models/name";
import createAnswerCollection from "@/Models/server/answer.collection";
import createQuestionCollection from "@/Models/server/question.collection";
import createCommentCollection from "@/Models/server/comment.collection";
import createVoteCollection from "@/Models/server/votes.collection";
import {databases} from "./config";

export default async function getOrCreateDb() {
    try {
        await databases.get(db);
        console.log("Database connected");
    } catch (error) {
        try {
            await databases.create(db, db);
            console.log("database created");

            //  created collection
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection(),
            ]);

            console.log("Collection created")
            console.log("Database connected")
        } catch (error) {
            console.log("Error creating ...", error)
        }
    }

    return databases;
}