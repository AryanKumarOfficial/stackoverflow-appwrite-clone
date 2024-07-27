import Image from "next/image";
import RTE from "@/components/RTE";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Hello</h1>
            <RTE/>
        </main>
    );
}
