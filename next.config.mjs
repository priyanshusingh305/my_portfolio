/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.aceternity.com"],
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
};

export default nextConfig;
