"use client";

import React from "react";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import QuestionForm from "@/components/QuestionFormComponent";
import Particles from "@/components/magicui/particles";
import toast from "react-hot-toast";

const AskQuestionPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to ask a question");
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return <div className="block pb-20 pt-32">
      <div className="container mx-auto px-4">
        <h1 className="mb-10 mt-4 text-2xl">Redirecting to login...</h1>
      </div>
    </div>;
  }

  return (
    <>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={300}
        ease={100}
        color="#ffffff"
        refresh
      />
      <div className="block pb-20 pt-32 relative">
        <div className="container mx-auto px-4">
          <h1 className="mb-10 mt-4 text-2xl">Ask a public question</h1>

          <div className="flex flex-wrap md:flex-row-reverse">
            <div className="w-full md:w-1/3 md:pl-6">
              <div className="mb-6 rounded-lg bg-white/5 p-4">
                <h2 className="mb-3 text-lg font-semibold">Tips for asking</h2>
                <ul className="list-inside list-disc space-y-2 text-sm">
                  <li>Summarize your problem in a one-line title</li>
                  <li>Describe your problem in detail</li>
                  <li>Describe what you've tried</li>
                  <li>Use proper formatting for code blocks</li>
                  <li>Add relevant tags to help categorize your question</li>
                  <li>Include an image if it helps explain your problem</li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <QuestionForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AskQuestionPage;
