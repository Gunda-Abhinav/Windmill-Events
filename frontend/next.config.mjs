/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack(config, { dev }) {
    // In development Next.js/webpack may use eval-based source maps which are
    // blocked by strict CSPs. Use a non-eval devtool to avoid `eval` usage.
    if (dev) {
      try {
        config.devtool = 'source-map'
      } catch (e) {
        // If configuration can't be set, swallow the error and proceed.
        // This is non-fatal for starting the dev server.
        console.warn('Could not override webpack devtool:', e)
      }
    }
    return config
  },
}

export default nextConfig
