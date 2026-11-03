/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // Vercel's image optimizer returns 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED)
    // once the plan's optimization quota is exhausted, breaking every <Image>.
    // Serve source images directly instead. Remote hosts below already optimize/resize.
    unoptimized: true,
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
