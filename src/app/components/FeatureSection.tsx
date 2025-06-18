"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import Link from "next/link";

export default function FeatureSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Why Choose RiverFlow?
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Experience the next generation of developer collaboration with our
          modern Q&A platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        {/* Ask Questions */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Ask Questions, Get Answers
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Post your coding questions and get help from experienced
              developers worldwide. Our community is always ready to assist with
              detailed explanations and solutions.
            </p>
          </div>
          <div className="absolute -right-4 lg:-right-[40%] -bottom-10 object-contain rounded-2xl">
            <div className="text-8xl opacity-20">❓</div>
          </div>
        </WobbleCard>

        {/* Share Knowledge */}
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-800">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Share Your Expertise
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Help others by answering questions and sharing your knowledge. Build
            your reputation and become a recognized expert in your field.
          </p>
          <div className="absolute -right-10 -bottom-10 text-6xl opacity-20">
            💡
          </div>
        </WobbleCard>

        {/* Build Reputation */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Build Your Developer Profile
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
              Earn reputation points, showcase your skills, and connect with
              like-minded developers. Track your contributions and growth within
              the community.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Start Building
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 text-8xl opacity-20">
            🏆
          </div>
        </WobbleCard>

        {/* Real-time Collaboration */}
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-green-800">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Real-time Collaboration
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Engage in real-time discussions, vote on best answers, and
            collaborate on complex programming challenges with our interactive
            platform.
          </p>
          <div className="absolute -right-10 -bottom-10 text-6xl opacity-20">
            🤝
          </div>
        </WobbleCard>
      </div>
    </div>
  );
}
