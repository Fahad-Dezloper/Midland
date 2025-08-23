import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  allowedDevOrigins: [
    'https://72831fc42b27.ngrok-free.app'
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },  
};

export default nextConfig
