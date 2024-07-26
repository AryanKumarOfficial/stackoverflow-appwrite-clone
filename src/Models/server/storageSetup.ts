import {Permission} from "node-appwrite";
import {questionAttachmentBucket} from "@/Models/name";
import {storage} from "@/Models/server/config";


export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("storage connected");
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create("users"),
                    Permission.read("any"),
                    Permission.read("users"),
                    Permission.update("users"),
                    Permission.delete("users")
                ],
                false,
                undefined,
                undefined,
                ["jpeg", "jpg", "png", "gif", "webp", "heic"]
            );
            console.log("Storage created")
            console.log("Storage connected")
        } catch (error) {
            console.error("Error creating storage: ", error)
        }
    }
}