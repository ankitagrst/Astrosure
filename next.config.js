/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@fusionstrings/swisseph-wasm'],
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/@fusionstrings/swisseph-wasm/script/lib/swisseph_wasm.wasm',
      './node_modules/@fusionstrings/swisseph-wasm/script/lib/swisseph_wasm.internal.js',
      './node_modules/@fusionstrings/swisseph-wasm/script/src/wasm_node.js',
    ],
  },
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
