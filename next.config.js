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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, 
      use: [
        {
          loader: '@svgr/webpack',
          options: {
          },
        },
      ],
    });
    return config;
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: false,
});

module.exports = withPWA(nextConfig);

