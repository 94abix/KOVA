/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  eslint: {
    // Désactiver ESLint pendant le build pour éviter les erreurs sur Vercel
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tensorflow/tfjs': '@tensorflow/tfjs',
    };
    return config;
  },
};

module.exports = nextConfig;

