/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [],
  },
};

const prod = process.env.NODE_ENV === 'production'
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    disable: prod ? false : true,
    skipWaiting: true
});

module.exports = withPWA(nextConfig);
