/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Change this before deployment?
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
  ],
  assetPrefix: process.env.NODE_ENV === 'production' ? '/xnode' : undefined, // Can we import prefix.ts from this file?
  // assetPrefix: 'http://localhost:3334',
  reactStrictMode: false,
}

export default nextConfig
