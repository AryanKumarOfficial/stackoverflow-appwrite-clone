import React from "react";
import {HeroParallax} from "@/components/ui/hero-parallax";
import {databases} from "@/Models/server/config";
import {db, questionAttachmentBucket, questionCollection} from "@/Models/name";
import {Query} from "node-appwrite";
import slugify from "@/utils/slugify";
import {storage} from "@/Models/client/config";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(15),
    ]);

    return (
        <HeroParallax
            header={<HeroSectionHeader/>}
            products={questions.documents.map(q => ({
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: storage.getFilePreview(questionAttachmentBucket, q.attachmentId).href,
            }))}
        />
    );
}