import type { NextConfig } from "next";
const withPWA = require('next-pwa');

const nextConfig: NextConfig = {
  /* config options here */
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
};

export default withPWA(nextConfig);
