import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // Allow dev requests when served through DDEV (https://website.ddev.site)
  allowedDevOrigins: ['*.ddev.site'],
  async redirects() {
    // Blog posts moved from /posts/* to /blogs/*
    return [{source: '/posts/:slug', destination: '/blogs/:slug', permanent: true}]
  },
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
}

export default nextConfig
