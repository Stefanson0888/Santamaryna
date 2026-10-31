/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  experimental: {
    outputFileTracingIncludes: {
      '/api/render-order': [
        './node_modules/ffmpeg-static/ffmpeg',
      ],
    },
  },
}

module.exports = nextConfig
