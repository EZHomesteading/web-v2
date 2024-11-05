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
