import React from "react";
import HeroSection from "@/app/components/HeroSection";
import LatestQuestions from "@/app/components/LatestQuestions";
import TopContributers from "@/app/components/TopContributers";
import StatsSection from "@/app/components/StatsSection";
import FeatureSection from "@/app/components/FeatureSection";
import Particles from "@/components/magicui/particles";

export default function Home() {
  return (
    <>
      {/* Background particles */}
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={300}
        ease={100}
        color="#ffffff"
        refresh
      />

      <main className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <HeroSection />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
          <StatsSection />
        </section>

        {/* Feature Section */}
        <section className="py-20 animate-fadeInUp">
          <FeatureSection />
        </section>

        {/* Latest Questions */}
        <section className="py-20 bg-gradient-to-b from-black/10 to-black/30">
          <div className="container mx-auto px-4">
            <LatestQuestions />
          </div>
        </section>

        {/* Top Contributors */}
        <section className="py-20">
          <TopContributers />
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-t from-black/30 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Start asking questions, sharing knowledge, and connecting with
                developers from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Get Started Today
                </a>
                <a
                  href="/questions"
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  Browse Questions
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
