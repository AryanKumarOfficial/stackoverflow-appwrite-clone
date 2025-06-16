"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ID, Models } from "appwrite";
import { databases, storage } from "@/Models/client/config";
import { db, questionCollection, questionAttachmentBucket } from "@/Models/name";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import RTE from "./RTE";
import toast from "react-hot-toast";

interface QuestionFormProps {
  ques?: Models.Document;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ ques }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [title, setTitle] = useState(ques ? ques.title : "");
  const [content, setContent] = useState(ques ? ques.content : "");
  const [tags, setTags] = useState(ques ? ques.tags.join(", ") : "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (ques && ques.attachmentId) {
      // Set the preview for existing image
      setPreview(
        storage.getFilePreview(
          questionAttachmentBucket,
          ques.attachmentId
        ).href
      );
    }
  }, [ques]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a question");
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim() || !tags.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process tags
      const tagList = tags
        .split(",")
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.length > 0);
      
      let attachmentId = ques?.attachmentId || "";

      // Handle file upload if there is a new file
      if (file) {
        // Delete old attachment if it exists
        if (ques?.attachmentId) {
          try {
            await storage.deleteFile(questionAttachmentBucket, ques.attachmentId);
          } catch (error) {
            console.error("Error deleting old attachment:", error);
          }
        }

        // Upload new file
        const upload = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          file
        );
        attachmentId = upload.$id;
      }

      const questionData = {
        title,
        content,
        tags: tagList,
        authorId: user.$id,
        attachmentId,
      };

      if (ques) {
        // Update existing question
        await databases.updateDocument(
          db,
          questionCollection,
          ques.$id,
          questionData
        );
        toast.success("Question updated successfully");
        router.push(`/questions/${ques.$id}/${slugify(title)}`);
      } else {
        // Create new question
        const response = await databases.createDocument(
          db,
          questionCollection,
          ID.unique(),
          questionData
        );
        toast.success("Question posted successfully");
        router.push(`/questions/${response.$id}/${slugify(title)}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Error submitting question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block font-semibold">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to center a div with Tailwind CSS?"
          className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block font-semibold">
          Details
        </label>
        <RTE value={content} onChange={(value) => setContent(value || "")} />
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="block font-semibold">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. javascript, react, tailwind"
          className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
          required
        />
        <p className="text-sm text-gray-400">
          Add up to 5 tags to describe what your question is about. Separate tags with commas.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="attachment" className="block font-semibold">
          Attachment (Optional)
        </label>
        <input
          id="attachment"
          type="file"
          onChange={handleFileChange}
          className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
          accept="image/*"
        />
        <p className="text-sm text-gray-400">
          Add an image to help explain your question
        </p>
        
        {preview && (
          <div className="mt-2">
            <p className="mb-1 text-sm">Image Preview:</p>
            <img 
              src={preview} 
              alt="Attachment preview" 
              className="max-h-40 rounded-md border border-white/20"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting 
          ? (ques ? "Updating..." : "Posting...") 
          : (ques ? "Update Question" : "Post Question")}
      </button>
    </form>
  );
};

export default QuestionForm;
