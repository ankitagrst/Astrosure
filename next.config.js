/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@fusionstrings/swisseph-wasm'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
