/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false, // Temporarily disabled to help with deployment
   images: {
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [{ hostname: 'images.unsplash.com' }, { hostname: 'cdn.sanity.io' }, { hostname: 'ui-avatars.com' }],
      domains: ['cdn.sanity.io', 'ui-avatars.com'],
   },
   // Server Actions are enabled by default in Next.js 14, so we don't need this anymore
   
   // Enable strict TypeScript checking during build
   typescript: {
      ignoreBuildErrors: false,
   },
   
   // Enable strict ESLint checking during build
   eslint: {
      ignoreDuringBuilds: false,
   },
};

module.exports = nextConfig;
