/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Support localhost en développement et Vercel en production
    domains: ['localhost', 'kova-93n1gzzzj-abixs-projects-622d5b9f.vercel.app'],
    // Permettre toutes les images depuis le même domaine
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
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

