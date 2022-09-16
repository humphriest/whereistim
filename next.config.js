/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    GOOGLE_TOKEN: process.env.GOOGLE_TOKEN,
  },
};

module.exports = nextConfig;
