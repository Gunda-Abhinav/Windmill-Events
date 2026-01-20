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
