import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },  // Google profile images
      { protocol: "https", hostname: "k.kakaocdn.net" },              // Kakao profile images
      { protocol: "http",  hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "*.supabase.co" },               // Supabase storage
    ],
  },
};

export default nextConfig;
