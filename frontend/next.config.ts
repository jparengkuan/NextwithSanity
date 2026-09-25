import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // Allow dev requests when served through DDEV (https://website.ddev.site)
  allowedDevOrigins: ['*.ddev.site'],
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
}

export default nextConfig
