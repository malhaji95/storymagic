/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'storymagic-platform.vercel.app'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://storymagic-api.onrender.com/api' 
      : 'http://localhost:5000/api',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
