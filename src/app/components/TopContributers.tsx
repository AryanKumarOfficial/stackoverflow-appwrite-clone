// components/top-contributors.tsx
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { users } from "@/Models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { avatars } from "@/Models/client/config";
import Link from "next/link";

interface UserNotificationProps {
    user: Models.User<UserPrefs>;
}

const UserNotification = ({ user, rank }: UserNotificationProps & { rank: number }) => {
    // Safe access to potentially undefined properties
    const userName = user.name || "Unknown User";
    const reputation = user.prefs?.reputation || 0;
    const updatedAt = user.$updatedAt ? new Date(user.$updatedAt) : new Date();

    return (
        <figure
            className={cn(
                "relative group mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-300",
                "bg-gradient-to-br from-[#23234d]/80 to-[#0f3460]/80 border border-white/10 shadow-lg hover:scale-[1.03] hover:shadow-pink-400/30 hover:border-pink-400/40",
                "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-pink-400/10 before:to-indigo-400/10 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
            )}
        // style={{ zIndex: 10 - rank }}
        >
            <div className="flex flex-row items-center gap-4">
                <div className="relative">
                    <picture>
                        <img
                            src={avatars.getInitials(userName, 48, 48).href}
                            alt={userName}
                            className="rounded-full border-2 border-pink-400/40 shadow-md group-hover:border-indigo-400/60 transition-all duration-300"
                        />
                    </picture>
                    <span className={cn(
                        "absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-400 text-xs font-bold text-white shadow-md",
                        rank === 1 ? "scale-110" : ""
                    )}>{rank}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption
                        className="flex flex-row items-center whitespace-pre text-lg font-semibold text-white/90 group-hover:text-pink-400 transition-colors duration-300">
                        <span className="truncate max-w-[140px]">{userName}</span>
                        <span className="mx-2 text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">
                            {convertDateToRelativeTime(updatedAt)}
                        </span>
                    </figcaption>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-indigo-300 transition-colors duration-300 mt-1">
                        <span>Reputation</span>
                        <span className="mx-1">·</span>
                        <span className="font-bold text-pink-400 group-hover:text-indigo-400 transition-colors duration-300">{reputation}</span>
                    </p>
                </div>
            </div>
            <Link href={`/users/${user.$id}/${encodeURIComponent(userName)}`} className="absolute inset-0 z-10" tabIndex={-1} aria-label={`View ${userName}'s profile`} />
        </figure>
    );
};

export default async function TopContributors() {
    // Fetch up to 50 users, sort by reputation in JS, and show top 10
    const topUsers = await users.list<UserPrefs>([
        Query.limit(50),
    ]);
    // console.log("Top users fetched:", topUsers.users);
    // Filter, deduplicate, and sort by reputation descending
    const seen = new Set<string>(); // Specify that the set will hold strings
    const filtered = topUsers.users
        .filter(u => u.email && !isNaN(Number(u.prefs?.reputation)) && Number(u.prefs.reputation) > 0)
        .filter(u => {
            // Correctly check for and add the user's ID for deduplication
            if (seen.has(u.$id)) {
                return false;
            }
            seen.add(u.$id);
            return true;
        })
        .sort((a, b) => Number(b.prefs.reputation) - Number(a.prefs.reputation))
        .slice(0, 10); // Take the top 10 after sorting

    // console.log("Filtered and sorted users:", filtered);
    // DEBUG: Log filtered users
    console.log("seen users:", seen);
    console.log(filtered.map(u => u));
    return (
        <div
            className="relative flex max-h-[500px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#1a1a2e]/80 via-[#23234d]/80 to-[#0f3460]/80 shadow-2xl mt-40 border border-white/10 backdrop-blur-md">
            <h2 className="mb-8 text-4xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
                Top Contributors
            </h2>
            <AnimatedList className="w-full gap-6">
                {filtered.map((user, idx) => (
                    <UserNotification user={user} key={user.$id} rank={idx + 1} />
                ))}
            </AnimatedList>
        </div>
    );
}