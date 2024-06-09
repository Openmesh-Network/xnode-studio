/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: '/xue-signer/:call*',
      destination: 'https://remote-signer.plopmenz.com/xue-signer/:call*',
    },
    {
      source: '/xnode',
      destination: '/',
    },
    {
      source: '/xnode/:call*',
      destination: '/:call*',
    },
  ],
  basePath: process.env.NEXT_PUBLIC_PREFIX,
  reactStrictMode: false,
}

export default nextConfig
