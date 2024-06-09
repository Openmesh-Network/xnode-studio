/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Change this before deployment?
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
  ],
  assetPrefix: process.env.NEXT_PUBLIC_PREFIX,
  // assetPrefix: 'http://localhost:3334',
  reactStrictMode: false,
}

export default nextConfig
