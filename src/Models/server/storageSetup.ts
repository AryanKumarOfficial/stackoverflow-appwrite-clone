import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "@/Models/name";
import { storage } from "@/Models/server/config";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
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
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpeg", "jpg", "png", "gif", "webp", "heic"],
      );
    } catch (error) {
      console.error("Error creating storage: ", error);
    }
  }
}
