import {Permission} from "node-appwrite";
import {databases} from "@/Models/server/config";
import {db, voteCollection} from "@/Models/name";

export default async function createVoteCollection() {
    // creating collection
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Vote collection created");

    // create attributes

    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upVote", "downVote"], true),
        databases.createStringAttribute(db, voteCollection, "voteById", 50, true)
    ]);
    console.log("vote attributes created");
}