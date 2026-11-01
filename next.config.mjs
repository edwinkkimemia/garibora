/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.sh" },
    ],
  },
  experimental: {
    // serverActions enabled by default in v15; keep body limit generous for image meta
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
