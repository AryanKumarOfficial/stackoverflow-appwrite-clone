import React from "react";
import { databases } from "@/Models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/Models/name";
import NumberTicker from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";

export default async function StatsSection() {
  // Fetch stats data
  const [questions, answers, votes] = await Promise.all([
    databases
      .listDocuments(db, questionCollection, [])
      .catch(() => ({ total: 0 })),
    databases
      .listDocuments(db, answerCollection, [])
      .catch(() => ({ total: 0 })),
    databases.listDocuments(db, voteCollection, []).catch(() => ({ total: 0 })),
  ]);

  const stats = [
    {
      title: "Questions Asked",
      value: questions.total || 0,
      description: "Community questions",
      icon: "❓",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      title: "Answers Provided",
      value: answers.total || 0,
      description: "Helpful responses",
      icon: "💡",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Total Votes",
      value: votes.total || 0,
      description: "Community engagement",
      icon: "👍",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      title: "Active Developers",
      value: Math.floor((questions.total + answers.total) / 3) || 1,
      description: "Growing community",
      icon: "👥",
      gradient: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Community at a Glance
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Join thousands of developers sharing knowledge and solving problems
          together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={stat.title} className="relative group">
            <div className="relative h-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <BorderBeam
                size={250}
                duration={12 + index * 2}
                delay={index * 2}
              />

              {/* Icon */}
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Value */}
              <div
                className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                <NumberTicker value={stat.value} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {stat.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
