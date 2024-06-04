/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Change this before deployment?
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? 'https://openmesh-xnode.vercel.app'
      : 'http://localhost:3334',
}

module.exports = nextConfig
