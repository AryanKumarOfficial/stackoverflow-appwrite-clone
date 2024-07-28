import Image from "next/image";
import RTE from "@/components/RTE";
import HeroSectionHeader from "@/app/components/HeroSectionHeader";
import HeroSection from "@/app/components/HeroSection";
import LatestQuestions from "@/app/components/LatestQuestions";
import TopContributers from "@/app/components/TopContributers";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <HeroSection/>
            <LatestQuestions/>
            <TopContributers/>
        </main>
    );
}
