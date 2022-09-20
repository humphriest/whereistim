/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    GOOGLE_TOKEN: process.env.GOOGLE_TOKEN,
    MAPBOX_GL_TOKEN: process.env.MAPBOX_GL_TOKEN,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
