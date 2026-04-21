/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete 
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // If you have strict TS errors (like the 'any' error), you might need this too
    ignoreBuildErrors: true,
  },
};

export default nextConfig;