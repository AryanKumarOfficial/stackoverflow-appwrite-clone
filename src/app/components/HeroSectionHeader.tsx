"use client";

import ClientOnlyIconCloud from "@/components/ClientOnlyIconCloud";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/AuthStore";
import Link from "next/link";
import React from "react";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

const HeroSectionHeader = () => {
  const { session } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
          <div className="space-y-8 text-center lg:text-left max-w-2xl">
            <div className="space-y-4">
              <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-transparent">
                RiverFlow
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[#ff2975] to-[#8c1eff] mx-auto lg:mx-0 rounded-full"></div>
            </div>

            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-300 max-w-xl mx-auto lg:mx-0">
              Ask questions, share knowledge, and collaborate with developers
              worldwide. Join our community and enhance your coding skills!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {session ? (
                <Link href="/questions/ask">
                  <ShimmerButton className="shadow-2xl w-full sm:w-auto">
                    <span className="whitespace-pre-wrap text-center text-lg font-medium leading-none tracking-tight text-white px-4">
                      Ask a Question
                    </span>
                  </ShimmerButton>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <ShimmerButton className="shadow-2xl w-full sm:w-auto">
                      <span className="whitespace-pre-wrap text-center text-lg font-medium leading-none tracking-tight text-white px-4">
                        Get Started Free
                      </span>
                    </ShimmerButton>
                  </Link>
                  <Link
                    href="/login"
                    className="group relative rounded-full border border-white/20 px-8 py-4 font-medium text-white hover:bg-white/5 transition-all duration-300 w-full sm:w-auto text-center"
                  >
                    <span>Login</span>
                    <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-300" />
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>1000+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>5000+ Questions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center order-1 lg:order-2">
          <div className="relative max-w-[400px] lg:max-w-[500px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <IconCloud iconSlugs={slugs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionHeader;
