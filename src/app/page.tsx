import React from "react";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          RiverFlow
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Modern Q&A Platform for Developers
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/questions"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Questions
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-gray-300 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
