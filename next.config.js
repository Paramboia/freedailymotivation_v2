/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.clerk.com'],
  },
  // For Capacitor, we'll use development server instead of static export initially
  // This allows us to test the mobile UI without dealing with static export complications
}

module.exports = nextConfig
