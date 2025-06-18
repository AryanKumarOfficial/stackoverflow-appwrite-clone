"use client";

import { useEffect, useState } from "react";
import IconCloud from "@/components/magicui/icon-cloud";

interface ClientOnlyIconCloudProps {
  iconSlugs: string[];
}

export default function ClientOnlyIconCloud({
  iconSlugs,
}: ClientOnlyIconCloudProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[400px]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <IconCloud iconSlugs={iconSlugs} />;
}
