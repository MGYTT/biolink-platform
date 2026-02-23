import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/u/:username',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // avatary z Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // avatary Google OAuth
      },
    ],
  },
}

export default nextConfig
