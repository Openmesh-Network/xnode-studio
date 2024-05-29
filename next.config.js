/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // TODO: Change this before deployment?
  assetPrefix: 'http://localhost:3334',
  // assetPrefix: 'https://openmesh-xnode.vercel.app',
}

module.exports = nextConfig
