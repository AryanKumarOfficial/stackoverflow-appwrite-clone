"use client";

import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { useLatestQuestions } from "@/hooks/api/questions";
import { storage } from "@/Models/client/config";
import { questionAttachmentBucket } from "@/Models/name";
import slugify from "@/utils/slugify";
import HeroSectionHeader from "./HeroSectionHeader";

export default function HeroSection() {
  const { data: questions, isLoading } = useLatestQuestions(15);

  // Provide fallback products while loading
  const products =
    questions?.map((q) => ({
      title: q.title,
      link: `/questions/${q.$id}/${slugify(q.title)}`,
      thumbnail: q.attachmentId
        ? storage.getFileView(questionAttachmentBucket, q.attachmentId).href
        : "/placeholder-question.jpg", // Add a placeholder image
    })) || [];

  // Show a loading state or use placeholder data
  if (isLoading || products.length === 0) {
    // Provide some placeholder products for the parallax effect
    const placeholderProducts = Array.from({ length: 15 }, (_, i) => ({
      title: `Sample Question ${i + 1}`,
      link: "#",
      thumbnail: "/placeholder-question.jpg",
    }));

    return (
      <HeroParallax
        header={<HeroSectionHeader />}
        products={placeholderProducts}
      />
    );
  }

  return <HeroParallax header={<HeroSectionHeader />} products={products} />;
}
