import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // any other Next.js config options
};

export default withPWA(nextConfig);
