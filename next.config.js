/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: false,
});

module.exports = withPWA(nextConfig);