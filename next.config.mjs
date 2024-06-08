/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Change this before deployment?
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
  ],
  // assetPrefix: 'https://openmesh-xnode.vercel.app',
  // assetPrefix: 'http://localhost:3334',
  reactStrictMode: false,
}

export default nextConfig
