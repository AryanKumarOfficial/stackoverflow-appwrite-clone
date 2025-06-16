/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cloud.appwrite.io"
            }
        ]
    },
    // Disable caching for the entire site
    staticPageGenerationTimeout: 1000,
    compiler: {
        styledComponents: true,
    },
    experimental: {
        // Ensure pages are not cached
        isrMemoryCacheSize: 0,
    },
};

export default nextConfig;
